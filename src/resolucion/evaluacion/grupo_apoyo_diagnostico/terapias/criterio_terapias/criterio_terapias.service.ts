import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MessageDto } from 'src/common/message.dto';
import { CriterioTerapiaEntity } from '../criterios_terapias.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TerapiasEntity } from '../terapias.entity';
import { CriterioTerapiaRepository } from '../criterios_terapias.repository';
import { TerapiaRepository } from '../terapias.repository';
import { CriterioTerapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/terapias_dto/criterios_terapias.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriterioTerapiasService {


    constructor(
        @InjectRepository(CriterioTerapiaEntity)
        private readonly criterioTerapiaRepository: CriterioTerapiaRepository,
        @InjectRepository(TerapiasEntity)
        private readonly terapiaRepository: TerapiaRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioTerapiaEntity[]> {
        const cri_tera = await this.criterioTerapiaRepository.createQueryBuilder('criterio')
            .select(['criterio', 'terapia.ter_nombre_estandar'])
            .innerJoin('criterio.terapia', 'terapia')
            .where('terapia.ter_id = :tera_est', { tera_est: id })
            .getMany()
        if (!cri_tera) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_tera
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioTerapiaEntity[]> {
        const criterio = await this.criterioTerapiaRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO TERAPIA
    async create(ter_id: number, payloads: { dto: CriterioTerapiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const terapia = await this.terapiaRepository.findOne({ where: { ter_id: ter_id } });
            if (!terapia) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioterapia = this.criterioTerapiaRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioterapia.terapia = terapia
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

            await this.criterioTerapiaRepository.save(criterioterapia)
            await this.auditoria_registro_services.logCreateTerapias(
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

    //ENCONTRAR POR ID - CRITERIO TERAPIA
    async findById(criter_id: number): Promise<CriterioTerapiaEntity> {
        const criterio_terapia = await this.criterioTerapiaRepository.findOne({ where: { criter_id } });
        if (!criterio_terapia) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_terapia;
    }

    //ELIMINAR CRITERIO TERAPIA
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_terapia = await this.findById(id);

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
            await this.criterioTerapiaRepository.delete(criterio_terapia.criter_id)
            await this.auditoria_eliminacion_services.logDeleteTerapias(
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

    //ACTUALIZAR CRITERIOS TERAPIAS
    async update(id: number, payloads: { dto: CriterioTerapiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_terapia = await this.findById(id);
            if (!criterio_terapia) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.criter_modalidad ? criterio_terapia.criter_modalidad = dto.criter_modalidad : criterio_terapia.criter_modalidad = criterio_terapia.criter_modalidad;
            dto.criter_complejidad ? criterio_terapia.criter_complejidad = dto.criter_complejidad : criterio_terapia.criter_complejidad = criterio_terapia.criter_complejidad;
            criterio_terapia.criter_articulo = dto.criter_articulo !== undefined ? dto.criter_articulo : "";
            dto.criter_nombre_criterio ? criterio_terapia.criter_nombre_criterio = dto.criter_nombre_criterio : criterio_terapia.criter_nombre_criterio = criterio_terapia.criter_nombre_criterio;

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

            await this.criterioTerapiaRepository.save(criterio_terapia);
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
