import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioQuimioterapiaEntity } from '../criterio_quimioterapia.entity';
import { QuimioterapiaEntity } from '../quimioterapia.entity';
import { CriterioQuimioterapiaRepository } from '../criterio_quimioterapia.repository';
import { QuimioterapiaRepository } from '../quimioterapia.repository';
import { CriterioQuimioterapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/quimioterapia_dto/criterio_quimioterapia.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriterioQuimioterapiaService {

    constructor(
        @InjectRepository(CriterioQuimioterapiaEntity)
        private readonly criterioQuimioterapiaRepository: CriterioQuimioterapiaRepository,
        @InjectRepository(QuimioterapiaEntity)
        private readonly quimioterapiaRepository: QuimioterapiaRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioQuimioterapiaEntity[]> {
        const cri_quimio = await this.criterioQuimioterapiaRepository.createQueryBuilder('criterio')
            .select(['criterio', 'quimioterapia.quim_nombre_estandar'])
            .innerJoin('criterio.quimioterapia', 'quimioterapia')
            .where('quimioterapia.quim_id = :quim_est', { quim_est: id })
            .getMany()
        if (!cri_quimio) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_quimio
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioQuimioterapiaEntity[]> {
        const criterio = await this.criterioQuimioterapiaRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO QUIMIOTERAPIA
    async create(quim_id: number, payloads: { dto: CriterioQuimioterapiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const quimioterapia = await this.quimioterapiaRepository.findOne({ where: { quim_id: quim_id } });
            if (!quimioterapia) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioquimioterapia = this.criterioQuimioterapiaRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioquimioterapia.quimioterapia = quimioterapia

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

            await this.criterioQuimioterapiaRepository.save(criterioquimioterapia)
            await this.auditoria_registro_services.logCreateQuimioterapia(
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

    //ENCONTRAR POR ID - CRITERIO QUIMIOTERAPIA
    async findById(criquim_id: number): Promise<CriterioQuimioterapiaEntity> {
        const cri_quimio = await this.criterioQuimioterapiaRepository.findOne({ where: { criquim_id } });
        if (!cri_quimio) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_quimio;
    }

    //ELIMINAR CRITERIO QUIMIOTERAPIA
    async delete(id: number, tokenDto: TokenDto ): Promise<any> {
        try {
            const cri_quimio = await this.findById(id);

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
            await this.criterioQuimioterapiaRepository.delete(cri_quimio.criquim_id)
            await this.auditoria_eliminacion_services.logDeleteQuimioterapia(
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

    
    //ACTUALIZAR CRITERIOS QUIMIOTERAPIA
    async update(id: number, payloads: { dto: CriterioQuimioterapiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_quimioterapia = await this.findById(id);
            if (!criterio_quimioterapia) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.criquim_modalidad ? criterio_quimioterapia.criquim_modalidad = dto.criquim_modalidad : criterio_quimioterapia.criquim_modalidad = criterio_quimioterapia.criquim_modalidad;
            dto.criquim_complejidad ? criterio_quimioterapia.criquim_complejidad = dto.criquim_complejidad : criterio_quimioterapia.criquim_complejidad = criterio_quimioterapia.criquim_complejidad;
            criterio_quimioterapia.criquim_articulo = dto.criquim_articulo !== undefined ? dto.criquim_articulo : "";
            dto.criquim_nombre_criterio ? criterio_quimioterapia.criquim_nombre_criterio = dto.criquim_nombre_criterio : criterio_quimioterapia.criquim_nombre_criterio = criterio_quimioterapia.criquim_nombre_criterio;
    
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

            await this.criterioQuimioterapiaRepository.save(criterio_quimioterapia);
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
