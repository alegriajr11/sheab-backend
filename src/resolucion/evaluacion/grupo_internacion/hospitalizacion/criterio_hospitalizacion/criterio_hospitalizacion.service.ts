import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioHospitalizacionEntity } from '../criterio_hospitalizacion.entity';
import { HospitalizacionEntity } from '../hospitalizacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioHospitalizacionRepository } from '../criterio_hospitalizacion.repository';
import { HospitalizacionRepository } from '../hospitalizacion.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioHospitalizacionDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_dto/criterio_hospitalizacion.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriterioHospitalizacionService {

    constructor(
        @InjectRepository(CriterioHospitalizacionEntity)
        private readonly criterioHospitalizacionRepository: CriterioHospitalizacionRepository,
        @InjectRepository(HospitalizacionEntity)
        private readonly hospitalizacionRepository: HospitalizacionRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioHospitalizacionEntity[]> {
        const cri_hosp = await this.criterioHospitalizacionRepository.createQueryBuilder('criterio')
            .select(['criterio', 'hospitalizacion.hosp_nombre_estandar'])
            .innerJoin('criterio.hospitalizacion', 'hospitalizacion')
            .where('hospitalizacion.hosp_id = :hosp_est', { hosp_est: id })
            .getMany()
        if (!cri_hosp) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_hosp
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioHospitalizacionEntity[]> {
        const criterio = await this.criterioHospitalizacionRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(hosp_id: number, payloads: { dto: CriterioHospitalizacionDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const hospitalizacion = await this.hospitalizacionRepository.findOne({ where: { hosp_id: hosp_id } });
            if (!hospitalizacion) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioshospitalizacionl = this.criterioHospitalizacionRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioshospitalizacionl.hospitalizacion = hospitalizacion

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

            await this.criterioHospitalizacionRepository.save(criterioshospitalizacionl)
            await this.auditoria_registro_services.logCreateHospitalizacion(
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

    //ENCONTRAR POR ID - CRITERIO HOSPITALIZACION
    async findById(crihosp_id: number): Promise<CriterioHospitalizacionEntity> {
        const criterio_hospitalizacion = await this.criterioHospitalizacionRepository.findOne({ where: { crihosp_id } });
        if (!criterio_hospitalizacion) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_hospitalizacion;
    }

    //ELIMINAR CRITERIO  HOSPITALIZACION
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_hospitalizacion = await this.findById(id);

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
            await this.criterioHospitalizacionRepository.delete(criterio_hospitalizacion.crihosp_id)
            await this.auditoria_eliminacion_services.logDeleteHospitalizacion(
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

    //ACTUALIZAR CRITERIOS HOSPITALIZACION
    async update(id: number, payloads: { dto: CriterioHospitalizacionDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_hospitalizacion = await this.findById(id);
            if (!criterio_hospitalizacion) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crihosp_modalidad ? criterio_hospitalizacion.crihosp_modalidad = dto.crihosp_modalidad : criterio_hospitalizacion.crihosp_modalidad = criterio_hospitalizacion.crihosp_modalidad;
            dto.crihosp_complejidad ? criterio_hospitalizacion.crihosp_complejidad = dto.crihosp_complejidad : criterio_hospitalizacion.crihosp_complejidad = criterio_hospitalizacion.crihosp_complejidad;
            criterio_hospitalizacion.crihosp_articulo = dto.crihosp_articulo !== undefined ? dto.crihosp_articulo : "";
            dto.crihosp_nombre_criterio ? criterio_hospitalizacion.crihosp_nombre_criterio = dto.crihosp_nombre_criterio : criterio_hospitalizacion.crihosp_nombre_criterio = criterio_hospitalizacion.crihosp_nombre_criterio;
    
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

            await this.criterioHospitalizacionRepository.save(criterio_hospitalizacion);
            await this.auditoria_actualizacion_services.logUpdateHospitalizacion(
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

