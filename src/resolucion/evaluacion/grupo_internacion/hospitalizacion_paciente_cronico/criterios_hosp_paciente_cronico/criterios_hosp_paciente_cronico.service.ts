import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioHospitCronicoEntity } from '../criterio_hosp_paciente_cron.entity';
import { HospitalizacionCronicoEntity } from '../hospi_paciente_cronico.entity';
import { CriterioHospitCronicoRepository } from '../criterio_hosp_paciente_cron.repository';
import { HospitalizacionCronicoRepository } from '../hospi_paciente_cronico.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioHospitCronicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_paciente_cronico_dto/criterio_hosp_paciente_cron.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosHospPacienteCronicoService {

    constructor(
        @InjectRepository(CriterioHospitCronicoEntity)
        private readonly criterioHospitCronicoRepository: CriterioHospitCronicoRepository,
        @InjectRepository(HospitalizacionCronicoEntity)
        private readonly hospitalizacionCronicoRepository: HospitalizacionCronicoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioHospitCronicoEntity[]> {
        const cri_hosp_cro = await this.criterioHospitCronicoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'hospit_cronico.hosp_cron_nombre_estandar'])
            .innerJoin('criterio.hospit_cronico', 'hospit_cronico')
            .where('hospit_cronico.hosp_cron_id = :hosp_cro_est', { hosp_cro_est: id })
            .getMany()
        if (!cri_hosp_cro) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_hosp_cro
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioHospitCronicoEntity[]> {
        const criterio = await this.criterioHospitCronicoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(hosp_cron_id: number, payloads: { dto: CriterioHospitCronicoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const hospitacronica = await this.hospitalizacionCronicoRepository.findOne({ where: { hosp_cron_id: hosp_cron_id } });
            if (!hospitacronica) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioshospitahospitacronica = this.criterioHospitCronicoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioshospitahospitacronica.hospit_cronico = hospitacronica

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

            await this.criterioHospitCronicoRepository.save(criterioshospitahospitacronica)
            await this.auditoria_registro_services.logCreateHospiPacienteCro(
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

    //ENCONTRAR POR ID - CRITERIO HOSPITALIZACION PACIENTE CRONICO
    async findById(crihosp_cron_id: number): Promise<CriterioHospitCronicoEntity> {
        const criterio_hosp_cron = await this.criterioHospitCronicoRepository.findOne({ where: { crihosp_cron_id } });
        if (!criterio_hosp_cron) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_hosp_cron;
    }

    //ELIMINAR CRITERIO  HOSPITALIZACION PACIENTE CRONICO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_hosp_cron = await this.findById(id);

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
            await this.criterioHospitCronicoRepository.delete(criterio_hosp_cron.crihosp_cron_id)
            await this.auditoria_eliminacion_services.logDeleteHospiPacienteCro(
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

    
    async update(id: number, payloads: { dto: CriterioHospitCronicoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_hosp_paciente_cron = await this.findById(id);
            if (!criterio_hosp_paciente_cron) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crihosp_cron_modalidad ? criterio_hosp_paciente_cron.crihosp_cron_modalidad = dto.crihosp_cron_modalidad : criterio_hosp_paciente_cron.crihosp_cron_modalidad = criterio_hosp_paciente_cron.crihosp_cron_modalidad;
            dto.crihosp_cron_complejidad ? criterio_hosp_paciente_cron.crihosp_cron_complejidad = dto.crihosp_cron_complejidad : criterio_hosp_paciente_cron.crihosp_cron_complejidad = criterio_hosp_paciente_cron.crihosp_cron_complejidad;
            criterio_hosp_paciente_cron.crihosp_cron_articulo = dto.crihosp_cron_articulo !== undefined ? dto.crihosp_cron_articulo : "";
            dto.crihosp_cron_nombre_criterio ? criterio_hosp_paciente_cron.crihosp_cron_nombre_criterio = dto.crihosp_cron_nombre_criterio : criterio_hosp_paciente_cron.crihosp_cron_nombre_criterio = criterio_hosp_paciente_cron.crihosp_cron_nombre_criterio;

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

            await this.criterioHospitCronicoRepository.save(criterio_hosp_paciente_cron);
            await this.auditoria_actualizacion_services.logUpdateHospiPacienteCro(
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
