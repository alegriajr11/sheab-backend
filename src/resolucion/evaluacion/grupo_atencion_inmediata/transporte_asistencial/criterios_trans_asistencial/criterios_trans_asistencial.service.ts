import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioTranspAsistencialEntity } from '../criterio_trans_asistencial.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TranspAsistencialEntity } from '../transporte_asistencial.entity';
import { TranspAsistencialRepository } from '../transporte_asistencial.repository';
import { CriterioTranspAsistencialRepository } from '../criterio_trans_asistencial.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioTranspAsistencialDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/transporte_asistencial_dto/criterio_trans_asistencial.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosTransAsistencialService {

    constructor(
        @InjectRepository(CriterioTranspAsistencialEntity)
        private readonly criterioTranspAsistencialRepository: CriterioTranspAsistencialRepository,
        @InjectRepository(TranspAsistencialEntity)
        private readonly transpAsistencialRepository: TranspAsistencialRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioTranspAsistencialEntity[]> {
        const cri_trans_asis = await this.criterioTranspAsistencialRepository.createQueryBuilder('criterio')
            .select(['criterio', 'transp_asistencial.trans_asis_nombre_estandar'])
            .innerJoin('criterio.transp_asistencial', 'transp_asistencial')
            .where('transp_asistencial.trans_asis_id = :asis_est', { asis_est: id })
            .getMany()
        if (!cri_trans_asis) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_trans_asis
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioTranspAsistencialEntity[]> {
        const criterio = await this.criterioTranspAsistencialRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO TRANSPORTE ASISTENCIAL
    async create(trans_asis_id: number, payloads: { dto: CriterioTranspAsistencialDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const transasis = await this.transpAsistencialRepository.findOne({ where: { trans_asis_id: trans_asis_id } });
            if (!transasis) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriotransasis = this.criterioTranspAsistencialRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriotransasis.transp_asistencial = transasis

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

            await this.criterioTranspAsistencialRepository.save(criteriotransasis)
            await this.auditoria_registro_services.logCreateTransAsistencial(
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


    //ENCONTRAR POR ID - CRITERIO TRANSPORTE ASISTENCIAL   
    async findById(cri_trans_asis_id: number): Promise<CriterioTranspAsistencialEntity> {
        const criterio_trans_asist = await this.criterioTranspAsistencialRepository.findOne({ where: { cri_trans_asis_id } });
        if (!criterio_trans_asist) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_trans_asist;
    }

    //ELIMINAR CRITERIO TRANSPORTE ASISTENCIAL 
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_trans_asist = await this.findById(id);

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
            await this.criterioTranspAsistencialRepository.delete(criterio_trans_asist.cri_trans_asis_id)
            await this.auditoria_eliminacion_services.logDeleteTransAsistencial(
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

    //ACTUALIZAR CRITERIOS TRANSPORTE ASISTENCIAL 
    async update(id: number, payloads: { dto: CriterioTranspAsistencialDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_trans_asist = await this.findById(id);
            if (!criterio_trans_asist) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_trans_asis_modalidad ? criterio_trans_asist.cri_trans_asis_modalidad = dto.cri_trans_asis_modalidad : criterio_trans_asist.cri_trans_asis_modalidad = criterio_trans_asist.cri_trans_asis_modalidad;
            dto.cri_trans_asis_complejidad ? criterio_trans_asist.cri_trans_asis_complejidad = dto.cri_trans_asis_complejidad : criterio_trans_asist.cri_trans_asis_complejidad = criterio_trans_asist.cri_trans_asis_complejidad;
            criterio_trans_asist.cri_trans_asis_articulo = dto.cri_trans_asis_articulo !== undefined ? dto.cri_trans_asis_articulo : "";
            dto.cri_trans_asis_nombre_criterio ? criterio_trans_asist.cri_trans_asis_nombre_criterio = dto.cri_trans_asis_nombre_criterio : criterio_trans_asist.cri_trans_asis_nombre_criterio = criterio_trans_asist.cri_trans_asis_nombre_criterio;

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

            await this.criterioTranspAsistencialRepository.save(criterio_trans_asist);
            await this.auditoria_actualizacion_services.logUpdateTransAsistencial(
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
