import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioLabHistotecnologiaEntity } from '../criterio_lab_histotec.entity';
import { CriterioLabHistotecnologiaRepository } from '../criterio_lab_histotec.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { LabHistotecnologiaEntity } from '../lab_histotecnologia.entity';
import { LabHistotecnologiaRepository } from '../lab_histotecnologia.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioLabHistotecnologiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_histotecnologia_dto/criterio_lab_histotec.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosLabHistotecnologiaService {

    constructor(
        @InjectRepository(CriterioLabHistotecnologiaEntity)
        private readonly criterioLabHistotecnologiaRepository: CriterioLabHistotecnologiaRepository,
        @InjectRepository(LabHistotecnologiaEntity)
        private readonly labHistotecnologiaRepository: LabHistotecnologiaRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioLabHistotecnologiaEntity[]> {
        const cri_lab_hidtec = await this.criterioLabHistotecnologiaRepository.createQueryBuilder('criterio')
            .select(['criterio', 'lab_histotecnologia.labhisto_nombre_estandar'])
            .innerJoin('criterio.lab_histotecnologia', 'lab_histotecnologia')
            .where('lab_histotecnologia.labhisto_id = :histo_est', { histo_est: id })
            .getMany()
        if (!cri_lab_hidtec) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_lab_hidtec
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioLabHistotecnologiaEntity[]> {
        const criterio = await this.criterioLabHistotecnologiaRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }


    //METODO AGREGAR CRITERIO-LABORATORIO HISTOTECNOLOGIA
    async create(labhisto_id: number, payloads: { dto: CriterioLabHistotecnologiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const labhistotec = await this.labHistotecnologiaRepository.findOne({ where: { labhisto_id: labhisto_id } });
            if (!labhistotec) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriolablabhistotec = this.criterioLabHistotecnologiaRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriolablabhistotec.lab_histotecnologia = labhistotec

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioLabHistotecnologiaRepository.save(criteriolablabhistotec)
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

            await this.auditoria_registro_services.logCreateLabHistotec(
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

    //ENCONTRAR POR ID - CRITERIO LABORATORIO HISTOTECNOLOGIA
    async findById(cri_lab_histo_id: number): Promise<CriterioLabHistotecnologiaEntity> {
        const cri_lab_histo = await this.criterioLabHistotecnologiaRepository.findOne({ where: { cri_lab_histo_id } });
        if (!cri_lab_histo) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_lab_histo;
    }

    //ELIMINAR CRITERIO LABORATORIO HISTOTECNOLOGIA
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const cri_lab_histo = await this.findById(id);

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
            await this.criterioLabHistotecnologiaRepository.delete(cri_lab_histo.cri_lab_histo_id)
            await this.auditoria_eliminacion_services.logDeleteLabHistotec(
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

    //ACTUALIZAR CRITERIOS  LABORATORIO HISTOTECNOLOGIA
    async updateLab_Histo(id: number, payloads: { dto: CriterioLabHistotecnologiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_lab_histotec = await this.findById(id);
            if (!criterio_lab_histotec) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_lab_histo_modalidad ? criterio_lab_histotec.cri_lab_histo_modalidad = dto.cri_lab_histo_modalidad : criterio_lab_histotec.cri_lab_histo_modalidad = criterio_lab_histotec.cri_lab_histo_modalidad;
            dto.cri_lab_histo_complejidad ? criterio_lab_histotec.cri_lab_histo_complejidad = dto.cri_lab_histo_complejidad : criterio_lab_histotec.cri_lab_histo_complejidad = criterio_lab_histotec.cri_lab_histo_complejidad;
            criterio_lab_histotec.cri_lab_histo_articulo = dto.cri_lab_histo_articulo !== undefined ? dto.cri_lab_histo_articulo : "";
            dto.cri_lab_histo_nombre_criterio ? criterio_lab_histotec.cri_lab_histo_nombre_criterio = dto.cri_lab_histo_nombre_criterio : criterio_lab_histotec.cri_lab_histo_nombre_criterio = criterio_lab_histotec.cri_lab_histo_nombre_criterio;

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

            await this.criterioLabHistotecnologiaRepository.save(criterio_lab_histotec);
            await this.auditoria_actualizacion_services.logUpdateLabHistotec(
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
