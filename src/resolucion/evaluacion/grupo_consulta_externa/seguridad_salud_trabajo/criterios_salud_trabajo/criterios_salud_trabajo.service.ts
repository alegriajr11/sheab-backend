import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioSaludTrabajoEntity } from '../criterios_salud_trabajo.entity';
import { CriterioSaludTrabajoRepository } from '../criterios_salud_trabajo.repository';
import { SaludTrabajoRepository } from '../salud_trabajo.repository';
import { SaludTrabajoEntity } from '../salud_trabajo.entity';
import { MessageDto } from 'src/common/message.dto';
import { CriterioSaludTrabajoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/seguridad_salud_trabajo_dto/criterios_salud_trabajo.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class CriteriosSaludTrabajoService {

    constructor(
        @InjectRepository(CriterioSaludTrabajoEntity)
        private readonly criterioSaludTrabajoRepository: CriterioSaludTrabajoRepository,
        @InjectRepository(SaludTrabajoEntity)
        private readonly saludTrabajoRepository: SaludTrabajoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioSaludTrabajoEntity[]> {
        const cri_sal_tra = await this.criterioSaludTrabajoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'salud_trabajo.saltra_nombre_estandar'])
            .innerJoin('criterio.salud_trabajo', 'salud_trabajo')
            .where('salud_trabajo.saltra_id = :sal_tra_est', { sal_tra_est: id })
            .getMany()
        if (!cri_sal_tra) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_sal_tra
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioSaludTrabajoEntity[]> {
        const criterio = await this.criterioSaludTrabajoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(saltra_id: number, payloads: { dto: CriterioSaludTrabajoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const saludtraba = await this.saludTrabajoRepository.findOne({ where: { saltra_id: saltra_id } });
            if (!saludtraba) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriosaludtrabae = this.criterioSaludTrabajoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriosaludtrabae.salud_trabajo = saludtraba

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

            await this.criterioSaludTrabajoRepository.save(criteriosaludtrabae)
            await this.auditoria_registro_services.logCreateSeguSalud(
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

    //ENCONTRAR POR ID - CRITERIO SALUD TRABAJO  
    async findById(crisaltra_id: number): Promise<CriterioSaludTrabajoEntity> {
        const criterio_salud_trabajo = await this.criterioSaludTrabajoRepository.findOne({ where: { crisaltra_id } });
        if (!criterio_salud_trabajo) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_salud_trabajo;
    }

    //ELIMINAR CRITERIO  SALUD TRABAJO 
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_salud_trabajo = await this.findById(id);

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
            await this.criterioSaludTrabajoRepository.delete(criterio_salud_trabajo.crisaltra_id)
            await this.auditoria_eliminacion_services.logDeleteSeguSalud(
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

    
    async update(id: number, payloads: { dto: CriterioSaludTrabajoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_salud_trabajo = await this.findById(id);
            if (!criterio_salud_trabajo) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crisaltra_modalidad ? criterio_salud_trabajo.crisaltra_modalidad = dto.crisaltra_modalidad : criterio_salud_trabajo.crisaltra_modalidad = criterio_salud_trabajo.crisaltra_modalidad;
            dto.crisaltra_complejidad ? criterio_salud_trabajo.crisaltra_complejidad = dto.crisaltra_complejidad : criterio_salud_trabajo.crisaltra_complejidad = criterio_salud_trabajo.crisaltra_complejidad;
            criterio_salud_trabajo.crisaltra_articulo = dto.crisaltra_articulo !== undefined ? dto.crisaltra_articulo : "";
            dto.crisaltra_nombre_criterio ? criterio_salud_trabajo.crisaltra_nombre_criterio = dto.crisaltra_nombre_criterio : criterio_salud_trabajo.crisaltra_nombre_criterio = criterio_salud_trabajo.crisaltra_nombre_criterio;

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

            await this.criterioSaludTrabajoRepository.save(criterio_salud_trabajo);
            await this.auditoria_actualizacion_services.logUpdateSeguSalud(
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
