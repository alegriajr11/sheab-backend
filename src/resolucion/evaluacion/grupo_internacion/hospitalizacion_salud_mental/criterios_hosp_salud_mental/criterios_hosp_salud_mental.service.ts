import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioHospitalizacionMentalEntity } from '../criterio_hosp_salud_mental.entity';
import { HospitalizacionMentalEntity } from '../hosp_salud_mental.entity';
import { CriterioHospitalizacionMentalRepository } from '../criterio_hosp_salud_mental.repository';
import { HospitalizacionMentalRepository } from '../hosp_salud_mental.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioHospitalizacionMentalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_salud_mental_dto/criterio_hosp_salud_mental.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosHospSaludMentalService {

    constructor(
        @InjectRepository(CriterioHospitalizacionMentalEntity)
        private readonly criterioHospitalizacionMentalRepository: CriterioHospitalizacionMentalRepository,
        @InjectRepository(HospitalizacionMentalEntity)
        private readonly hospitalizacionMentalRepository: HospitalizacionMentalRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioHospitalizacionMentalEntity[]> {
        const cri_hosp_ment = await this.criterioHospitalizacionMentalRepository.createQueryBuilder('criterio')
            .select(['criterio', 'hospitalizacion_mental.hosp_mental_nombre_estandar'])
            .innerJoin('criterio.hospitalizacion_mental', 'hospitalizacion_mental')
            .where('hospitalizacion_mental.hosp_mental_id = :hosp_ment_est', { hosp_ment_est: id })
            .getMany()
        if (!cri_hosp_ment) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_hosp_ment
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioHospitalizacionMentalEntity[]> {
        const criterio = await this.criterioHospitalizacionMentalRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(hosp_mental_id: number, payloads: { dto: CriterioHospitalizacionMentalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const hospitamental = await this.hospitalizacionMentalRepository.findOne({ where: { hosp_mental_id: hosp_mental_id } });
            if (!hospitamental) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioshospitamental = this.criterioHospitalizacionMentalRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioshospitamental.hospitalizacion_mental = hospitamental

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

            await this.criterioHospitalizacionMentalRepository.save(criterioshospitamental);
            await this.auditoria_registro_services.logCreateHospiMental(
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

    //ENCONTRAR POR ID - CRITERIO HOSPITALIZACION MENTAL
    async findById(crihosp_ment_id: number): Promise<CriterioHospitalizacionMentalEntity> {
        const criterio_hosp_ment = await this.criterioHospitalizacionMentalRepository.findOne({ where: { crihosp_ment_id } });
        if (!criterio_hosp_ment) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_hosp_ment;
    }

    //ELIMINAR CRITERIO  HOSPITALIZACION MENTAL
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_hosp_ment = await this.findById(id);

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
            await this.criterioHospitalizacionMentalRepository.delete(criterio_hosp_ment.crihosp_ment_id);
            await this.auditoria_eliminacion_services.logDeleteHospiMental(
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

    //ACTUALIZAR CRITERIOS CUIDADO  HOSPITALIZACION MENTAL
    async update(id: number, payloads: { dto: CriterioHospitalizacionMentalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_hosp_ment = await this.findById(id);
            if (!criterio_hosp_ment) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crihosp_ment_modalidad ? criterio_hosp_ment.crihosp_ment_modalidad = dto.crihosp_ment_modalidad : criterio_hosp_ment.crihosp_ment_modalidad = criterio_hosp_ment.crihosp_ment_modalidad;
            dto.crihosp_ment_complejidad ? criterio_hosp_ment.crihosp_ment_complejidad = dto.crihosp_ment_complejidad : criterio_hosp_ment.crihosp_ment_complejidad = criterio_hosp_ment.crihosp_ment_complejidad;
            criterio_hosp_ment.crihosp_ment_articulo = dto.crihosp_ment_articulo !== undefined ? dto.crihosp_ment_articulo : "";
            dto.crihosp_ment_nombre_criterio ? criterio_hosp_ment.crihosp_ment_nombre_criterio = dto.crihosp_ment_nombre_criterio : criterio_hosp_ment.crihosp_ment_nombre_criterio = criterio_hosp_ment.crihosp_ment_nombre_criterio;

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

            await this.criterioHospitalizacionMentalRepository.save(criterio_hosp_ment);
            await this.auditoria_actualizacion_services.logUpdateHospiMental(
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
