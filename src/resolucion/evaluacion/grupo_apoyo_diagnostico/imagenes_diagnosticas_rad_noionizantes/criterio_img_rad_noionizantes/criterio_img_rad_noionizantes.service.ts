import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioImgRadNoIonizantesEntity } from '../criterio_img_rad_noionizantes.entity';
import { CriterioImgRadNoIonizanteRepository } from '../criterio_img_rad_noionizantes.repository';
import { ImgRadNoIonizantesRepository } from '../img_rad_noionizantes.repository';
import { ImgRadNoIonizantesEntity } from '../img_rad_noionizantes.entity';
import { MessageDto } from 'src/common/message.dto';
import { CriterioImgRadNoIonizantesDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/imagenes_diagnosticas_rad_noionizantes_dto/criterio_img_rad_noionizantes.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class CriterioImgRadNoionizantesService {

    constructor(
        @InjectRepository(CriterioImgRadNoIonizantesEntity)
        private readonly criterioImgRadNoIonizanteRepository: CriterioImgRadNoIonizanteRepository,
        @InjectRepository(ImgRadNoIonizantesEntity)
        private readonly imgRadNoIonizantesRepository: ImgRadNoIonizantesRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }

    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioImgRadNoIonizantesEntity[]> {
        const cri_img_noionizantes = await this.criterioImgRadNoIonizanteRepository.createQueryBuilder('criterio')
            .select(['criterio', 'imgrad_noionizante.imgrad_noion_nombre_estandar'])
            .innerJoin('criterio.imgrad_noionizante', 'imgrad_noionizante')
            .where('imgrad_noionizante.imgrad_noion_id = :noima_est', { noima_est: id })
            .getMany()
        if (!cri_img_noionizantes) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_img_noionizantes
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioImgRadNoIonizantesEntity[]> {
        const criterio = await this.criterioImgRadNoIonizanteRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //METODO AGREGAR  CRITERIO IMAGENES DIAGNOSTICAS RAD NO IONIZANTES
    async create(imgrad_noion_id: number, payloads: { dto: CriterioImgRadNoIonizantesDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const imanoioni = await this.imgRadNoIonizantesRepository.findOne({ where: { imgrad_noion_id: imgrad_noion_id } });
            if (!imanoioni) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioimanoioni = this.criterioImgRadNoIonizanteRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioimanoioni.imgrad_noionizante = imanoioni

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioImgRadNoIonizanteRepository.save(criterioimanoioni)
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

            await this.criterioImgRadNoIonizanteRepository.save(criterioimanoioni)
            await this.auditoria_registro_services.logCreateImaDiagRadNoIoni(
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


    //ENCONTRAR POR ID - CRITERIO IMAGENES DIAGNOSTICAS RAD NO IONIZANTES
    async findById(cri_img_noioni_id: number): Promise<CriterioImgRadNoIonizantesEntity> {
        const cri_ima_noioni = await this.criterioImgRadNoIonizanteRepository.findOne({ where: { cri_img_noioni_id } });
        if (!cri_ima_noioni) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_ima_noioni;
    }

    //ELIMINAR CRITERIO IMAGENES DIAGNOSTICAS RAD NO IONIZANTES
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const cri_ima_noioni = await this.findById(id);

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
            await this.criterioImgRadNoIonizanteRepository.delete(cri_ima_noioni.cri_img_noioni_id)
            await this.auditoria_eliminacion_services.logDeleteImaDiagRadNoIoni(
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


    //ACTUALIZAR CRITERIOS IMAGENES DIAGNOSTICAS RAD NO IONIZANTES
    async updateIma_Rad_Noio(id: number, payloads: { dto: CriterioImgRadNoIonizantesDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_img_rad_noionizantes = await this.findById(id);
            if (!criterio_img_rad_noionizantes) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_img_noioni_modalidad ? criterio_img_rad_noionizantes.cri_img_noioni_modalidad = dto.cri_img_noioni_modalidad : criterio_img_rad_noionizantes.cri_img_noioni_modalidad = criterio_img_rad_noionizantes.cri_img_noioni_modalidad;
            dto.cri_img_noioni_complejidad ? criterio_img_rad_noionizantes.cri_img_noioni_complejidad = dto.cri_img_noioni_complejidad : criterio_img_rad_noionizantes.cri_img_noioni_complejidad = criterio_img_rad_noionizantes.cri_img_noioni_complejidad;
            criterio_img_rad_noionizantes.cri_img_noioni_articulo = dto.cri_img_noioni_articulo !== undefined ? dto.cri_img_noioni_articulo : "";
            dto.cri_img_noioni_nombre_criterio ? criterio_img_rad_noionizantes.cri_img_noioni_nombre_criterio = dto.cri_img_noioni_nombre_criterio : criterio_img_rad_noionizantes.cri_img_noioni_nombre_criterio = criterio_img_rad_noionizantes.cri_img_noioni_nombre_criterio;

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

            await this.criterioImgRadNoIonizanteRepository.save(criterio_img_rad_noionizantes);
            await this.auditoria_actualizacion_services.logUpdateImaDiagRadNoIoni(
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
