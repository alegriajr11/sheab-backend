import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioHermoIntervenEntity } from '../criterio_hemo_inter.entity';
import { CriterioHermoIntervenRepository } from '../criterio_hemo_inter.repository';
import { HermodIntervenEntity } from '../hemod_interven.entity';
import { HermodIntervenRepository } from '../hemod_interven.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioHermodinamiaIntervenDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/hemodinamia_intervencionismo_dto/criterio_hemo_inter.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosHemodIntervenService {

    constructor(
        @InjectRepository(CriterioHermoIntervenEntity)
        private readonly criterioHermoIntervenRepository: CriterioHermoIntervenRepository,
        @InjectRepository(HermodIntervenEntity)
        private readonly hermodIntervenRepository: HermodIntervenRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }

    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioHermoIntervenEntity[]> {
        const cri_hemo_inter = await this.criterioHermoIntervenRepository.createQueryBuilder('criterio')
            .select(['criterio', 'hermod_interven.hermointer_nombre_estandar'])
            .innerJoin('criterio.hermod_interven', 'hermod_interven')
            .where('hermod_interven.hermointer_id = :dial_est', { dial_est: id })
            .getMany()
        if (!cri_hemo_inter) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_hemo_inter
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioHermoIntervenEntity[]> {
        const criterio = await this.criterioHermoIntervenRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //METODO AGREGAR CRITERIO-HEMODINAMIA
    async create(hermointer_id: number, payloads: { dto: CriterioHermodinamiaIntervenDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const hermodinamia = await this.hermodIntervenRepository.findOne({ where: { hermointer_id: hermointer_id } });
            if (!hermodinamia) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriohermodinamia = this.criterioHermoIntervenRepository.create(dto);

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriohermodinamia.hermod_interven = hermodinamia;

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioHermoIntervenRepository.save(criteriohermodinamia);
            const usuario = await this.jwtService.decode(tokenDto.token);

            const payloadInterface: PayloadInterface = {
                usu_id: usuario[`usu_id`],
                usu_nombre: usuario[`usu_nombre`],
                usu_apellido: usuario[`usu_apellido`],
                usu_nombreUsuario: usuario[`usu_nombreUsuario`],
                usu_email: usuario[`usu_email`],
                usu_estado: usuario[`usu_estado`],
                usu_roles: usuario[`usu_roles`]
            };

            const year = new Date().getFullYear().toString();

            await this.criterioHermoIntervenRepository.save(criteriohermodinamia);
            await this.auditoria_registro_services.logCreateHemodinamia(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                year
            );

            return new MessageDto('El criterio ha sido Creado Correctamente');
        } catch (error) {
            // Aquí puedes manejar el error como desees, por ejemplo, registrarlo o lanzar una excepción personalizada.
            throw error;
        }
    }

    //ENCONTRAR POR ID - CRITERIO HEMODINAMINIA
    async findById(criherminte_id: number): Promise<CriterioHermoIntervenEntity> {
        const cri_hemodi = await this.criterioHermoIntervenRepository.findOne({ where: { criherminte_id } });
        if (!cri_hemodi) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_hemodi;
    }

    //ELIMINAR CRITERIO HEMODINAMINIA
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const cri_hemodi = await this.findById(id);

            const usuario = await this.jwtService.decode(tokenDto.token);

            const payloadInterface: PayloadInterface = {
                usu_id: usuario[`usu_id`],
                usu_nombre: usuario[`usu_nombre`],
                usu_apellido: usuario[`usu_apellido`],
                usu_nombreUsuario: usuario[`usu_nombreUsuario`],
                usu_email: usuario[`usu_email`],
                usu_estado: usuario[`usu_estado`],
                usu_roles: usuario[`usu_roles`]
            };

            const year = new Date().getFullYear().toString();
            await this.criterioHermoIntervenRepository.delete(cri_hemodi.criherminte_id)
            await this.auditoria_eliminacion_services.logDeleteHemodinamia(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                year
            );

            return new MessageDto(`Criterio Eliminado`);
        } catch (error) {
            // Aquí puedes manejar el error como desees, por ejemplo, registrarlo o lanzar una excepción personalizada.
            throw error;
        }

    }

    //ACTUALIZAR CRITERIOS HEMODINAMINIA
    async updateHemo(id: number, payloads: { dto: CriterioHermodinamiaIntervenDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_hemo_inter = await this.findById(id);
            if (!criterio_hemo_inter) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.criherminte_modalidad ? criterio_hemo_inter.criherminte_modalidad = dto.criherminte_modalidad : criterio_hemo_inter.criherminte_modalidad = criterio_hemo_inter.criherminte_modalidad;
            dto.criherminte_complejidad ? criterio_hemo_inter.criherminte_complejidad = dto.criherminte_complejidad : criterio_hemo_inter.criherminte_complejidad = criterio_hemo_inter.criherminte_complejidad;
            criterio_hemo_inter.criherminte_articulo = dto.criherminte_articulo !== undefined ? dto.criherminte_articulo : "";
            dto.criherminte_nombre_criterio ? criterio_hemo_inter.criherminte_nombre_criterio = dto.criherminte_nombre_criterio : criterio_hemo_inter.criherminte_nombre_criterio = criterio_hemo_inter.criherminte_nombre_criterio;

            const usuario = await this.jwtService.decode(tokenDto.token);

            const payloadInterface: PayloadInterface = {
                usu_id: usuario[`usu_id`],
                usu_nombre: usuario[`usu_nombre`],
                usu_apellido: usuario[`usu_apellido`],
                usu_nombreUsuario: usuario[`usu_nombreUsuario`],
                usu_email: usuario[`usu_email`],
                usu_estado: usuario[`usu_estado`],
                usu_roles: usuario[`usu_roles`]
            };

            const year = new Date().getFullYear().toString();

            await this.criterioHermoIntervenRepository.save(criterio_hemo_inter);
            await this.auditoria_actualizacion_services.logUpdateHemodinamia(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                year
            );



            return new MessageDto(`El criterio ha sido Actualizado`);
        } catch (error) {
            // Aquí puedes manejar el error como desees, por ejemplo, registrarlo o lanzar una excepción personalizada.
            throw error;
        }
    }
}
