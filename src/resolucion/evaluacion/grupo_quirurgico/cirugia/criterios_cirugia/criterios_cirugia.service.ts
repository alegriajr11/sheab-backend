import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioCirugiaEntity } from '../criterio_cirugia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CirugiaEntity } from '../cirugia.entity';
import { CirugiaRepository } from '../cirugia.repository';
import { CriterioCirugiaRepository } from '../criterio_cirugia.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCirugiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_quirurgico_dtos/cirugia_dto/criterio_cirugia.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosCirugiaService {

    constructor(
        @InjectRepository(CriterioCirugiaEntity)
        private readonly criterioCirugiaRepository: CriterioCirugiaRepository,
        @InjectRepository(CirugiaEntity)
        private readonly cirugiaRepository: CirugiaRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioCirugiaEntity[]> {
        const cri_ciru = await this.criterioCirugiaRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cirugia.ciru_nombre_estandar'])
            .innerJoin('criterio.cirugia', 'cirugia')
            .where('cirugia.ciru_id = :ciru_est', { ciru_est: id })
            .getMany()
        if (!cri_ciru) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_ciru
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioCirugiaEntity[]> {
        const criterio = await this.criterioCirugiaRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(ciru_id: number, payloads: { dto: CriterioCirugiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const cirugia = await this.cirugiaRepository.findOne({ where: { ciru_id: ciru_id } });
            if (!cirugia) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioscirugia = this.criterioCirugiaRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioscirugia.cirugia = cirugia

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

            await this.criterioCirugiaRepository.save(criterioscirugia);
            await this.auditoria_registro_services.logCreateCirugia(
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

    //ENCONTRAR POR ID - CRITERIO CIRUGIAL
    async findById(cri_ciru_id: number): Promise<CriterioCirugiaEntity> {
        const criterio_ciru = await this.criterioCirugiaRepository.findOne({ where: { cri_ciru_id } });
        if (!criterio_ciru) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_ciru;
    }

    //ELIMINAR CRITERIO  CIRUGIA
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_ciru = await this.findById(id);

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
            await this.criterioCirugiaRepository.delete(criterio_ciru.cri_ciru_id);
            await this.auditoria_eliminacion_services.logDeleteCirugia(
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

    

    async update(id: number, payloads: { dto: CriterioCirugiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_cirugia = await this.findById(id);
            if (!criterio_cirugia) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_ciru_modalidad ? criterio_cirugia.cri_ciru_modalidad = dto.cri_ciru_modalidad : criterio_cirugia.cri_ciru_modalidad = criterio_cirugia.cri_ciru_modalidad;
            dto.cri_ciru_complejidad ? criterio_cirugia.cri_ciru_complejidad = dto.cri_ciru_complejidad : criterio_cirugia.cri_ciru_complejidad = criterio_cirugia.cri_ciru_complejidad;
            criterio_cirugia.cri_ciru_articulo = dto.cri_ciru_articulo !== undefined ? dto.cri_ciru_articulo : "";
            dto.cri_ciru_nombre_criterio ? criterio_cirugia.cri_ciru_nombre_criterio = dto.cri_ciru_nombre_criterio : criterio_cirugia.cri_ciru_nombre_criterio = criterio_cirugia.cri_ciru_nombre_criterio;

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

            await this.criterioCirugiaRepository.save(criterio_cirugia);
            await this.auditoria_actualizacion_services.logUpdateCirugia(
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
