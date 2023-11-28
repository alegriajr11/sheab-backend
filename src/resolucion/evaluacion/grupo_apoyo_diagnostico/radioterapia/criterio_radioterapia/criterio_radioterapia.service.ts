import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioRadioterapiaEntity } from '../criterio_radioterapia.entity';
import { RadioterapiaEntity } from '../radioterapia.entity';
import { RadioterapiaRepository } from '../radioterapia.repository';
import { CriterioRadioterapiaRepository } from '../criterio_radioterapia.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioRadioterapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/radioterapia_dto/criterio_radioterapia.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriterioRadioterapiaService {


    constructor(
        @InjectRepository(CriterioRadioterapiaEntity)
        private readonly criterioRadioterapiaRepository: CriterioRadioterapiaRepository,
        @InjectRepository(RadioterapiaEntity)
        private readonly radioterapiaRepository: RadioterapiaRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioRadioterapiaEntity[]> {
        const cri_radio = await this.criterioRadioterapiaRepository.createQueryBuilder('criterio')
            .select(['criterio', 'radioterapia.radi_nombre_estandar'])
            .innerJoin('criterio.radioterapia', 'radioterapia')
            .where('radioterapia.radi_id = :radio_est', { radio_est: id })
            .getMany()
        if (!cri_radio) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_radio
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioRadioterapiaEntity[]> {
        const criterio = await this.criterioRadioterapiaRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO RADIOTERAPIA
    async create(radi_id: number, payloads: { dto: CriterioRadioterapiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const radioterapia = await this.radioterapiaRepository.findOne({ where: { radi_id: radi_id } });
            if (!radioterapia) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioradioterapia = this.criterioRadioterapiaRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioradioterapia.radioterapia = radioterapia

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

            await this.criterioRadioterapiaRepository.save(criterioradioterapia)
            await this.auditoria_registro_services.logCreateRadioterapia(
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


    //ENCONTRAR POR ID - CRITERIO RADIOTERAPIA
    async findById(crirad_ter_id: number): Promise<CriterioRadioterapiaEntity> {
        const criterio_radioterapia = await this.criterioRadioterapiaRepository.findOne({ where: { crirad_ter_id } });
        if (!criterio_radioterapia) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_radioterapia;
    }

    //ELIMINAR CRITERIO RADIOTERAPIA
    async delete(id: number, tokenDto: TokenDto ): Promise<any> {
        try {
            const criterio_radioterapia = await this.findById(id);

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
            await this.criterioRadioterapiaRepository.delete(criterio_radioterapia.crirad_ter_id)
            await this.auditoria_eliminacion_services.logDeleteRadioterapia(
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

    //ACTUALIZAR CRITERIOS RADIOTERAPIA
    async update(id: number, payloads: { dto: CriterioRadioterapiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_radioterapia = await this.findById(id);
            if (!criterio_radioterapia) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crirad_ter_modalidad ? criterio_radioterapia.crirad_ter_modalidad = dto.crirad_ter_modalidad : criterio_radioterapia.crirad_ter_modalidad = criterio_radioterapia.crirad_ter_modalidad;
            dto.crirad_ter_complejidad ? criterio_radioterapia.crirad_ter_complejidad = dto.crirad_ter_complejidad : criterio_radioterapia.crirad_ter_complejidad = criterio_radioterapia.crirad_ter_complejidad;
            criterio_radioterapia.crirad_ter_articulo = dto.crirad_ter_articulo !== undefined ? dto.crirad_ter_articulo : "";
            dto.crirad_ter_nombre_criterio ? criterio_radioterapia.crirad_ter_nombre_criterio = dto.crirad_ter_nombre_criterio : criterio_radioterapia.crirad_ter_nombre_criterio = criterio_radioterapia.crirad_ter_nombre_criterio;
    
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

            await this.criterioRadioterapiaRepository.save(criterio_radioterapia);
            await this.auditoria_actualizacion_services.logUpdateQuimioterapia(
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
