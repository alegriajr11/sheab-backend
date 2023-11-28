import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioCuidIntermNeonatalEntity } from '../criterio_cuid_inter_neonatal.entity';
import { CuidIntermNeonatalEntity } from '../cuid_inter_neonatal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioCuidIntermNeonatalRepository } from '../criterio_cuid_inter_neonatal.repository';
import { CuidIntermNeonatalRepository } from '../cuid_inter_neonatal.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntermNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_neonatal_dto/criterio_cuid_inter_neonatal.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class CriteriosCuidInterNeonatalService {

    constructor(
        @InjectRepository(CriterioCuidIntermNeonatalEntity)
        private readonly criterioCuidIntermNeonatalRepository: CriterioCuidIntermNeonatalRepository,
        @InjectRepository(CuidIntermNeonatalEntity)
        private readonly cuidIntermNeonatalRepository: CuidIntermNeonatalRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioCuidIntermNeonatalEntity[]> {
        const cri_cuid_neo = await this.criterioCuidIntermNeonatalRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cuid_inter_neonatal.cuid_inter_adult_nombre_estandar'])
            .innerJoin('criterio.cuid_inter_neonatal', 'cuid_inter_neonatal')
            .where('cuid_inter_neonatal.cuid_inter_adult_id = :cuid_neo_est', { cuid_neo_est: id })
            .getMany()
        if (!cri_cuid_neo) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_cuid_neo
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioCuidIntermNeonatalEntity[]> {
        const criterio = await this.criterioCuidIntermNeonatalRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(cuid_inter_adult_id: number, payloads: { dto: CriterioCuidIntermNeonatalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const cuiinteradul = await this.cuidIntermNeonatalRepository.findOne({ where: { cuid_inter_adult_id: cuid_inter_adult_id } });
            if (!cuiinteradul) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioscuiinteradul = this.criterioCuidIntermNeonatalRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioscuiinteradul.cuid_inter_neonatal = cuiinteradul

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

            await this.criterioCuidIntermNeonatalRepository.save(criterioscuiinteradul)
            await this.auditoria_registro_services.logCreateInterNeonatal(
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


    //ENCONTRAR POR ID - CRITERIO CUIDADO  INTERMEDIO NEONATAL
    async findById(cri_inter_neon_id: number): Promise<CriterioCuidIntermNeonatalEntity> {
        const criterio_inter_neon = await this.criterioCuidIntermNeonatalRepository.findOne({ where: { cri_inter_neon_id } });
        if (!criterio_inter_neon) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_inter_neon;
    }

    //ELIMINAR CRITERIO  CUIDADO  INTERMEDIO NEONATAL
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_inter_neon = await this.findById(id);

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
            await this.criterioCuidIntermNeonatalRepository.delete(criterio_inter_neon.cri_inter_neon_id)
            await this.auditoria_eliminacion_services.logDeleteInterNeonatal(
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

    //ACTUALIZAR CRITERIOS CUIDADO INTERMEDIO NEONATAL
    async update(id: number, payloads: { dto: CriterioCuidIntermNeonatalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_cuid_inter_neo = await this.findById(id);
            if (!criterio_cuid_inter_neo) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_inter_neon_modalidad ? criterio_cuid_inter_neo.cri_inter_neon_modalidad = dto.cri_inter_neon_modalidad : criterio_cuid_inter_neo.cri_inter_neon_modalidad = criterio_cuid_inter_neo.cri_inter_neon_modalidad;
            dto.cri_inter_neon_complejidad ? criterio_cuid_inter_neo.cri_inter_neon_complejidad = dto.cri_inter_neon_complejidad : criterio_cuid_inter_neo.cri_inter_neon_complejidad = criterio_cuid_inter_neo.cri_inter_neon_complejidad;
            criterio_cuid_inter_neo.cri_inter_neon_articulo = dto.cri_inter_neon_articulo !== undefined ? dto.cri_inter_neon_articulo : "";
            dto.cri_inter_neon_nombre_criterio ? criterio_cuid_inter_neo.cri_inter_neon_nombre_criterio = dto.cri_inter_neon_nombre_criterio : criterio_cuid_inter_neo.cri_inter_neon_nombre_criterio = criterio_cuid_inter_neo.cri_inter_neon_nombre_criterio;

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

            await this.criterioCuidIntermNeonatalRepository.save(criterio_cuid_inter_neo);
            await this.auditoria_actualizacion_services.logUpdateInterNeonatal(
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
