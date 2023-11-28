import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioCuidIntermAdultoEntity } from '../criterio_cuid_inter_adulto.entity';
import { CuidIntermAdultoEntity } from '../cuid_inter_adulto.entity';
import { CriterioCuidIntermAdultoRepository } from '../criterio_cuid_inter_adulto.repository';
import { CuidIntermAdultoRepository } from '../cuid_inter_adulto.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntermAdultoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_adulto_dto/criterio_cuid_inter_adulto.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosCuidInterAdultoService {

    constructor(
        @InjectRepository(CriterioCuidIntermAdultoEntity)
        private readonly criterioCuidIntermAdultoRepository: CriterioCuidIntermAdultoRepository,
        @InjectRepository(CuidIntermAdultoEntity)
        private readonly cuidIntermAdultoRepository: CuidIntermAdultoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioCuidIntermAdultoEntity[]> {
        const cri_cuid_inter = await this.criterioCuidIntermAdultoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cuid_inter_adulto.cuid_inter_adult_nombre_estandar'])
            .innerJoin('criterio.cuid_inter_adulto', 'cuid_inter_adulto')
            .where('cuid_inter_adulto.cuid_inter_adult_id = :inter_adul_est', { inter_adul_est: id })
            .getMany()
        if (!cri_cuid_inter) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_cuid_inter
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioCuidIntermAdultoEntity[]> {
        const criterio = await this.criterioCuidIntermAdultoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }


    //CREAR CRITERIO
    async create(cuid_inter_adult_id: number, payloads: { dto: CriterioCuidIntermAdultoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const cuiinteradul = await this.cuidIntermAdultoRepository.findOne({ where: { cuid_inter_adult_id: cuid_inter_adult_id } });
            if (!cuiinteradul) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioscuiinteradul = this.criterioCuidIntermAdultoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioscuiinteradul.cuid_inter_adulto = cuiinteradul

            //GUARDAR LOS DATOS EN LA BD
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

            await this.criterioCuidIntermAdultoRepository.save(criterioscuiinteradul)
            await this.auditoria_registro_services.logCreateInterAdulto(
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


    //ENCONTRAR POR ID - CRITERIO CUIDADO  INTERMEDIO ADULTO
    async findById(cri_inter_adult_id: number): Promise<CriterioCuidIntermAdultoEntity> {
        const criterio_inter_adult = await this.criterioCuidIntermAdultoRepository.findOne({ where: { cri_inter_adult_id } });
        if (!criterio_inter_adult) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_inter_adult;
    }

    //ELIMINAR CRITERIO  CUIDADO  INTERMEDIO ADULTO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_inter_adult = await this.findById(id);

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
            await this.criterioCuidIntermAdultoRepository.delete(criterio_inter_adult.cri_inter_adult_id)
            await this.auditoria_eliminacion_services.logDeleteInterAdulto(
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

    //ACTUALIZAR CRITERIOS CUIDADO INTERMEDIO ADULTO
    async update(id: number, payloads: { dto: CriterioCuidIntermAdultoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_cuid_inter_adulto = await this.findById(id);
            if (!criterio_cuid_inter_adulto) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_inter_adult_modalidad ? criterio_cuid_inter_adulto.cri_inter_adult_modalidad = dto.cri_inter_adult_modalidad : criterio_cuid_inter_adulto.cri_inter_adult_modalidad = criterio_cuid_inter_adulto.cri_inter_adult_modalidad;
            dto.cri_inter_adult_complejidad ? criterio_cuid_inter_adulto.cri_inter_adult_complejidad = dto.cri_inter_adult_complejidad : criterio_cuid_inter_adulto.cri_inter_adult_complejidad = criterio_cuid_inter_adulto.cri_inter_adult_complejidad;
            criterio_cuid_inter_adulto.cri_inter_adult_articulo = dto.cri_inter_adult_articulo !== undefined ? dto.cri_inter_adult_articulo : "";
            dto.cri_inter_adult_nombre_criterio ? criterio_cuid_inter_adulto.cri_inter_adult_nombre_criterio = dto.cri_inter_adult_nombre_criterio : criterio_cuid_inter_adulto.cri_inter_adult_nombre_criterio = criterio_cuid_inter_adulto.cri_inter_adult_nombre_criterio;

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

            await this.criterioCuidIntermAdultoRepository.save(criterio_cuid_inter_adulto);
            await this.auditoria_actualizacion_services.logUpdateInterAdulto(
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
