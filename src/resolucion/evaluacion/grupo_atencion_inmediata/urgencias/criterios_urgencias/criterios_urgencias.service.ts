import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioUrgenciasEntity } from '../criterio_urgencias.entity';
import { UrgenciasEntity } from '../urgencias.entity';
import { UrgenciasRepository } from '../urgencias.repository';
import { CriterioUrgenciasRepository } from '../criterio_urgencias.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioUrgenciasDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/urgencias_dto/criterio_urgencias.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosUrgenciasService {

    constructor(
        @InjectRepository(CriterioUrgenciasEntity)
        private readonly criterioUrgenciasRepository: CriterioUrgenciasRepository,
        @InjectRepository(UrgenciasEntity)
        private readonly urgenciasRepository: UrgenciasRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }

    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioUrgenciasEntity[]> {
        const cri_urge = await this.criterioUrgenciasRepository.createQueryBuilder('criterio')
            .select(['criterio', 'urgencias.urg_nombre_estandar'])
            .innerJoin('criterio.urgencias', 'urgencias')
            .where('urgencias.urg_id = :urge_est', { urge_est: id })
            .getMany()
        if (!cri_urge) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_urge
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioUrgenciasEntity[]> {
        const criterio = await this.criterioUrgenciasRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO URGENCIAS
    async create(urg_id: number, payloads: { dto: CriterioUrgenciasDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const urgencias = await this.urgenciasRepository.findOne({ where: { urg_id: urg_id } });
            if (!urgencias) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriourgencias = this.criterioUrgenciasRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriourgencias.urgencias = urgencias

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

            await this.criterioUrgenciasRepository.save(criteriourgencias)
            await this.auditoria_registro_services.logCreateUrgencias(
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

    //ENCONTRAR POR ID - CRITERIO TRANSPORTE URGENCIAS   
    async findById(criurge_id: number): Promise<CriterioUrgenciasEntity> {
        const criterio_urgencias = await this.criterioUrgenciasRepository.findOne({ where: { criurge_id } });
        if (!criterio_urgencias) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_urgencias;
    }

    //ELIMINAR CRITERIO  URGENCIAS 
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_urgencias = await this.findById(id);
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
            await this.criterioUrgenciasRepository.delete(criterio_urgencias.criurge_id)
            await this.auditoria_eliminacion_services.logDeleteUrgencias(
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

    //ACTUALIZAR CRITERIOS URGENCIAS
    async update(id: number, payloads: { dto: CriterioUrgenciasDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_urgencias = await this.findById(id);
            if (!criterio_urgencias) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.criurge_modalidad ? criterio_urgencias.criurge_modalidad = dto.criurge_modalidad : criterio_urgencias.criurge_modalidad = criterio_urgencias.criurge_modalidad;
            dto.criurge_complejidad ? criterio_urgencias.criurge_complejidad = dto.criurge_complejidad : criterio_urgencias.criurge_complejidad = criterio_urgencias.criurge_complejidad;
            criterio_urgencias.criurge_articulo = dto.criurge_articulo !== undefined ? dto.criurge_articulo : "";
            dto.criurge_nombre_criterio ? criterio_urgencias.criurge_nombre_criterio = dto.criurge_nombre_criterio : criterio_urgencias.criurge_nombre_criterio = criterio_urgencias.criurge_nombre_criterio;

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

            await this.criterioUrgenciasRepository.save(criterio_urgencias);
            await this.auditoria_actualizacion_services.logUpdateUrgencias(
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
