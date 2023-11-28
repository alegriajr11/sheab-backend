import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioCuelloUterinoEntity } from '../criterio_tom_muest_cuello.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CuelloUterinoEntity } from '../tom_muestras_cuello_uter.entity';
import { CriterioCuelloUterinoRepository } from '../criterio_tom_muest_cuello.repository';
import { CuelloUterinoRepository } from '../tom_muestras_cuello_uter.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuelloUterinoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/toma_muestras_cuello_uterino_dto/criterio_tom_muest_cuello.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosMuesCuelloService {

    constructor(
        @InjectRepository(CriterioCuelloUterinoEntity)
        private readonly criterioCuelloUterinoRepository: CriterioCuelloUterinoRepository,
        @InjectRepository(CuelloUterinoEntity)
        private readonly cuelloUterinoRepository: CuelloUterinoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioCuelloUterinoEntity[]> {
        const cri_cuello = await this.criterioCuelloUterinoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cue_uterino.cuel_ute_nombre_estandar'])
            .innerJoin('criterio.cue_uterino', 'cue_uterino')
            .where('cue_uterino.cuel_ute_id = :uteri_est', { uteri_est: id })
            .getMany()
        if (!cri_cuello) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_cuello
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioCuelloUterinoEntity[]> {
        const criterio = await this.criterioCuelloUterinoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO CUELLO UTERINO
    async create(cuel_ute_id: number, payloads: { dto: CriterioCuelloUterinoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const cuellouterino = await this.cuelloUterinoRepository.findOne({ where: { cuel_ute_id: cuel_ute_id } });
            if (!cuellouterino) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriocuellouterino = this.criterioCuelloUterinoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriocuellouterino.cue_uterino = cuellouterino

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

            await this.criterioCuelloUterinoRepository.save(criteriocuellouterino)
            await this.auditoria_registro_services.logCreateTomMuestrasUterinas(
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

    //ENCONTRAR POR ID - CRITERIO CUELLO UTERINO
    async findById(cri_cuel_ute_id: number): Promise<CriterioCuelloUterinoEntity> {
        const criterio_mue_cuello_ute = await this.criterioCuelloUterinoRepository.findOne({ where: { cri_cuel_ute_id } });
        if (!criterio_mue_cuello_ute) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_mue_cuello_ute;
    }

    //ELIMINAR CRITERIO CUELLO UTERINO
    async delete(id: number, tokenDto: TokenDto ): Promise<any> {
        try {
            const criterio_mue_cuello_ute = await this.findById(id);

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
            await this.criterioCuelloUterinoRepository.delete(criterio_mue_cuello_ute.cri_cuel_ute_id)
            await this.auditoria_eliminacion_services.logDeleteTomMuestrasUterinas(
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

    //ACTUALIZAR CRITERIOS CUELLO UTERINO
    async update(id: number, payloads: { dto: CriterioCuelloUterinoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_mue_cuello_ute = await this.findById(id);
            if (!criterio_mue_cuello_ute) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_cuel_ute_modalidad ? criterio_mue_cuello_ute.cri_cuel_ute_modalidad = dto.cri_cuel_ute_modalidad : criterio_mue_cuello_ute.cri_cuel_ute_modalidad = criterio_mue_cuello_ute.cri_cuel_ute_modalidad;
            dto.cri_cuel_ute_complejidad ? criterio_mue_cuello_ute.cri_cuel_ute_complejidad = dto.cri_cuel_ute_complejidad : criterio_mue_cuello_ute.cri_cuel_ute_complejidad = criterio_mue_cuello_ute.cri_cuel_ute_complejidad;
            criterio_mue_cuello_ute.cri_cuel_ute_articulo = dto.cri_cuel_ute_articulo !== undefined ? dto.cri_cuel_ute_articulo : "";
            dto.cri_cuel_ute_nombre_criterio ? criterio_mue_cuello_ute.cri_cuel_ute_nombre_criterio = dto.cri_cuel_ute_nombre_criterio : criterio_mue_cuello_ute.cri_cuel_ute_nombre_criterio = criterio_mue_cuello_ute.cri_cuel_ute_nombre_criterio;
    
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

            await this.criterioCuelloUterinoRepository.save(criterio_mue_cuello_ute);
            await this.auditoria_actualizacion_services.logUpdateTomMuestrasUterinas(
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
