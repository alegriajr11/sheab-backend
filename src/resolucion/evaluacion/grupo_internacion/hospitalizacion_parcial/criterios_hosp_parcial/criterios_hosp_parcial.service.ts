import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioHospitalizacionParcialEntity } from '../criterio_hosp_parcial.entity';
import { HospitalizacionParcialEntity } from '../hospitalizacion_parcial.entity';
import { CriterioHospitalizacionParcialRepository } from '../criterio_hosp_parcial.repository';
import { HospitalizacionParcialRepository } from '../hospitalizacion_parcial.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioHospitalizacionParcialDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_parcial_dto/criterio_hosp_parcial.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosHospParcialService {

    constructor(
        @InjectRepository(CriterioHospitalizacionParcialEntity)
        private readonly criterioHospitalizacionParcialRepository: CriterioHospitalizacionParcialRepository,
        @InjectRepository(HospitalizacionParcialEntity)
        private readonly hospitalizacionParcialRepository: HospitalizacionParcialRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioHospitalizacionParcialEntity[]> {
        const cri_hos_par = await this.criterioHospitalizacionParcialRepository.createQueryBuilder('criterio')
            .select(['criterio', 'hospitalizacion_parcial.hosp_parc_nombre_estandar'])
            .innerJoin('criterio.hospitalizacion_parcial', 'hospitalizacion_parcial')
            .where('hospitalizacion_parcial.hosp_parc__id = :hos_par_est', { hos_par_est: id })
            .getMany()
        if (!cri_hos_par) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_hos_par
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioHospitalizacionParcialEntity[]> {
        const criterio = await this.criterioHospitalizacionParcialRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(hosp_parc__id: number, payloads: { dto: CriterioHospitalizacionParcialDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const hospitaparcial = await this.hospitalizacionParcialRepository.findOne({ where: { hosp_parc__id: hosp_parc__id } });
            if (!hospitaparcial) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioshospitahospitaparcial = this.criterioHospitalizacionParcialRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioshospitahospitaparcial.hospitalizacion_parcial = hospitaparcial

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

            await this.criterioHospitalizacionParcialRepository.save(criterioshospitahospitaparcial);
            await this.auditoria_registro_services.logCreateHospiParcial(
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

    //ENCONTRAR POR ID - CRITERIO HOSPITALIZACION PARCIAL
    async findById(crihosp_parc_id: number): Promise<CriterioHospitalizacionParcialEntity> {
        const criterio_hosp_parc = await this.criterioHospitalizacionParcialRepository.findOne({ where: { crihosp_parc_id } });
        if (!criterio_hosp_parc) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_hosp_parc;
    }

    //ELIMINAR CRITERIO  HOSPITALIZACION PARCIAL
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_hosp_parc = await this.findById(id);

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
            await this.criterioHospitalizacionParcialRepository.delete(criterio_hosp_parc.crihosp_parc_id);
            await this.auditoria_eliminacion_services.logDeleteHospiParcial(
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

    //ACTUALIZAR CRITERIOS CUIDADO  HOSPITALIZACION PARCIAL
    async update(id: number, payloads: { dto: CriterioHospitalizacionParcialDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_hosp_parc = await this.findById(id);
            if (!criterio_hosp_parc) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crihosp_parc_modalidad ? criterio_hosp_parc.crihosp_parc_modalidad = dto.crihosp_parc_modalidad : criterio_hosp_parc.crihosp_parc_modalidad = criterio_hosp_parc.crihosp_parc_modalidad;
            dto.crihosp_parc_complejidad ? criterio_hosp_parc.crihosp_parc_complejidad = dto.crihosp_parc_complejidad : criterio_hosp_parc.crihosp_parc_complejidad = criterio_hosp_parc.crihosp_parc_complejidad;
            criterio_hosp_parc.crihosp_parc_articulo = dto.crihosp_parc_articulo !== undefined ? dto.crihosp_parc_articulo : "";
            dto.crihosp_parc_nombre_criterio ? criterio_hosp_parc.crihosp_parc_nombre_criterio = dto.crihosp_parc_nombre_criterio : criterio_hosp_parc.crihosp_parc_nombre_criterio = criterio_hosp_parc.crihosp_parc_nombre_criterio;

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

            await this.criterioHospitalizacionParcialRepository.save(criterio_hosp_parc);
            await this.auditoria_actualizacion_services.logUpdateHospiParcial(
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
