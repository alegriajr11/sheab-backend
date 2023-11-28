import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioImgRadIonizantesEntity } from '../criterio_img_rad_ionizantes.entity';
import { CriterioImgRadIonizanteRepository } from '../criterio_img_rad_ionizantes.repository';
import { ImgRadIonizantesEntity } from '../img_rad_ionizantes.entity';
import { ImgRadIonizantesRepository } from '../img_rad_ionizantes.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioImgRadIonizantesDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/imagenes_diagnosticas_rad_ionizantes_dto/criterio_img_rad_ionizantes.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriterioImgRadIonizantesService {
    constructor(
        @InjectRepository(CriterioImgRadIonizantesEntity)
        private readonly criterioImgRadIonizanteRepository: CriterioImgRadIonizanteRepository,
        @InjectRepository(ImgRadIonizantesEntity)
        private readonly imgRadIonizantesRepository: ImgRadIonizantesRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }

    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioImgRadIonizantesEntity[]> {
        const cri_img_rad_ion = await this.criterioImgRadIonizanteRepository.createQueryBuilder('criterio')
            .select(['criterio', 'imgrad_ionizante.imgradion_nombre_estandar'])
            .innerJoin('criterio.imgrad_ionizante', 'imgrad_ionizante')
            .where('imgrad_ionizante.imgradion_id = :ima_est', { ima_est: id })
            .getMany()
        if (!cri_img_rad_ion) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_img_rad_ion
    }

     //LISTAR TODOS CRITERIOS
     async getall(): Promise<CriterioImgRadIonizantesEntity[]> {
        const criterio = await this.criterioImgRadIonizanteRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //METODO AGREGAR CRITERIO IMAGENES DIAGNOSTICAS RAD IONIZANTES
    async create(imgradion_id: number, payloads: { dto: CriterioImgRadIonizantesDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const imaioni = await this.imgRadIonizantesRepository.findOne({ where: { imgradion_id: imgradion_id } });
            if (!imaioni) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioimaioni = this.criterioImgRadIonizanteRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioimaioni.imgrad_ionizante = imaioni

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioImgRadIonizanteRepository.save(criterioimaioni)
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

            await this.criterioImgRadIonizanteRepository.save(criterioimaioni)
            await this.auditoria_registro_services.logCreateImaDiagRadIoni(
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

    //ENCONTRAR POR ID - CRITERIO IMAGENES DIAGNOSTICAS RAD IONIZANTES
    async findById(cri_imgioni_id: number): Promise<CriterioImgRadIonizantesEntity> {
        const cri_ima_ioni = await this.criterioImgRadIonizanteRepository.findOne({ where: { cri_imgioni_id } });
        if (!cri_ima_ioni) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_ima_ioni;
    }

    //ELIMINAR CRITERIO IMAGENES DIAGNOSTICAS RAD IONIZANTES
    async delete(id: number, tokenDto: TokenDto ): Promise<any> {
        try {
            const cri_ima_ioni = await this.findById(id);

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
            await this.criterioImgRadIonizanteRepository.delete(cri_ima_ioni.cri_imgioni_id)
            await this.auditoria_eliminacion_services.logDeleteImaDiagRadIoni(
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

    //ACTUALIZAR CRITERIOS IMAGENES DIAGNOSTICAS RAD IONIZANTES
    async updateIma_Rad(id: number, payloads: { dto: CriterioImgRadIonizantesDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_img_rad_ionizantes = await this.findById(id);
            if (!criterio_img_rad_ionizantes) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_imgioni_modalidad ? criterio_img_rad_ionizantes.cri_imgioni_modalidad = dto.cri_imgioni_modalidad : criterio_img_rad_ionizantes.cri_imgioni_modalidad = criterio_img_rad_ionizantes.cri_imgioni_modalidad;
            dto.cri_imgioni_complejidad ? criterio_img_rad_ionizantes.cri_imgioni_complejidad = dto.cri_imgioni_complejidad : criterio_img_rad_ionizantes.cri_imgioni_complejidad = criterio_img_rad_ionizantes.cri_imgioni_complejidad;
            criterio_img_rad_ionizantes.cri_imgioni_articulo = dto.cri_imgioni_articulo !== undefined ? dto.cri_imgioni_articulo : "";
            dto.cri_imgioni_nombre_criterio ? criterio_img_rad_ionizantes.cri_imgioni_nombre_criterio = dto.cri_imgioni_nombre_criterio : criterio_img_rad_ionizantes.cri_imgioni_nombre_criterio = criterio_img_rad_ionizantes.cri_imgioni_nombre_criterio;
    
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

            await this.criterioImgRadIonizanteRepository.save(criterio_img_rad_ionizantes);
            await this.auditoria_actualizacion_services.logUpdateImaDiagRadIoni(
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


