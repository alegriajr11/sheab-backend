import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioGestionPretransfusionalEntity } from '../criterio_gestion_pretrans.entity';
import { CriterioGestionPretransfusionalRepository } from '../criterio_gestion_pretrans.repository';
import { GestionPretransfusionalEntity } from '../gestion_pretrans.entity';
import { GestionPretransfusionalRepository } from '../gestion_pretrans.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioGestionPretransfusionalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/gestion_pretransfusional_dto/criterio_gestion_pretrans.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosGestionPretransService {
    constructor(
        @InjectRepository(CriterioGestionPretransfusionalEntity)
        private readonly criterioGestionPretransfusionalRepository: CriterioGestionPretransfusionalRepository,
        @InjectRepository(GestionPretransfusionalEntity)
        private readonly gestionPretransfusionalRepository: GestionPretransfusionalRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }

    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioGestionPretransfusionalEntity[]> {
        const cri_gest_pretrasn = await this.criterioGestionPretransfusionalRepository.createQueryBuilder('criterio')
            .select(['criterio', 'gestion_pretransfusional.gestp_nombre_estandar'])
            .innerJoin('criterio.gestion_pretransfusional', 'gestion_pretransfusional')
            .where('gestion_pretransfusional.gestp_id = :dial_est', { dial_est: id })
            .getMany()
        if (!cri_gest_pretrasn) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_gest_pretrasn
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioGestionPretransfusionalEntity[]> {
        const criterio = await this.criterioGestionPretransfusionalRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //METODO AGREGAR CRITERIO-GESTION PRETRANS
    async create(gestp_id: number, dto: CriterioGestionPretransfusionalDto): Promise<any> {
        const gestionpretans = await this.gestionPretransfusionalRepository.findOne({ where: { gestp_id: gestp_id } });
        if (!gestionpretans) throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'))
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const criteriogestionpretans = this.criterioGestionPretransfusionalRepository.create(dto)
        //ASIGNAMOS EL ESTANDAR AL CRITERIO
        criteriogestionpretans.gestion_pretransfusional = gestionpretans
        //GUARDAR LOS DATOS EN LA BD
        await this.criterioGestionPretransfusionalRepository.save(criteriogestionpretans)
        return new MessageDto('El criterio ha sido Creado Correctamente');
    }

    async createGestionPreTrans(gestp_id: number, payloads: { dto: CriterioGestionPretransfusionalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const gestionpretans = await this.gestionPretransfusionalRepository.findOne({ where: { gestp_id: gestp_id } });
            if (!gestionpretans) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriogestionpretans = this.criterioGestionPretransfusionalRepository.create(dto);

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriogestionpretans.gestion_pretransfusional = gestionpretans;

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioGestionPretransfusionalRepository.save(criteriogestionpretans);
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

            await this.criterioGestionPretransfusionalRepository.save(criteriogestionpretans);
            await this.auditoria_registro_services.logCreatePretransfusional(
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

    //ENCONTRAR POR ID - CRITERIO PRETANSFUNCIONAL
    async findById(crigestpre_id: number): Promise<CriterioGestionPretransfusionalEntity> {
        const cri_pre_trans = await this.criterioGestionPretransfusionalRepository.findOne({ where: { crigestpre_id } });
        if (!cri_pre_trans) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_pre_trans;
    }

    //ELIMINAR CRITERIO PRETANSFUNCIONAL
    async delete(id: number, tokenDto: TokenDto ): Promise<any> {
        try {
            const cri_pretrans = await this.findById(id);

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
            await this.criterioGestionPretransfusionalRepository.delete(cri_pretrans.crigestpre_id)
            await this.auditoria_eliminacion_services.logDeletePretransfusional(
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

    //ACTUALIZAR CRITERIOS PRETRANSFUNSIONAL
    async updateGestion(id: number, payloads: { dto: CriterioGestionPretransfusionalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_gestion_pretrans = await this.findById(id);
            if (!criterio_gestion_pretrans) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crigestpre_modalidad ? criterio_gestion_pretrans.crigestpre_modalidad = dto.crigestpre_modalidad : criterio_gestion_pretrans.crigestpre_modalidad = criterio_gestion_pretrans.crigestpre_modalidad;
            dto.crigestpre_complejidad ? criterio_gestion_pretrans.crigestpre_complejidad = dto.crigestpre_complejidad : criterio_gestion_pretrans.crigestpre_complejidad = criterio_gestion_pretrans.crigestpre_complejidad;
            criterio_gestion_pretrans.crigestpre_articulo = dto.crigestpre_articulo !== undefined ? dto.crigestpre_articulo : "";
            dto.crigestpre_nombre_criterio ? criterio_gestion_pretrans.crigestpre_nombre_criterio = dto.crigestpre_nombre_criterio : criterio_gestion_pretrans.crigestpre_nombre_criterio = criterio_gestion_pretrans.crigestpre_nombre_criterio;
    
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

            await this.criterioGestionPretransfusionalRepository.save(criterio_gestion_pretrans);
            await this.auditoria_actualizacion_services.logUpdatePretransfusional(
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
