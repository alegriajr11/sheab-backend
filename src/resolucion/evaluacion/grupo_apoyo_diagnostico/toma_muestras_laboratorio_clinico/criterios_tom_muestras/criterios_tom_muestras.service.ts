import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioMuestraLabClinicoEntity } from '../criterio_tom_muestras.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MuestrasLabClinicoEntity } from '../tom_muestras.entity';
import { CriterioMuestraLabClinicoRepository } from '../criterio_tom_muestras.repository';
import { MuestrasLabClinicoRepository } from '../tom_muestras.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioMuestraLabClinicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/toma_muestras_laboratorio_clinico_dto/criterio_tom_muestras.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosTomMuestrasService {

    constructor(
        @InjectRepository(CriterioMuestraLabClinicoEntity)
        private readonly criterioMuestraLabClinicoRepository: CriterioMuestraLabClinicoRepository,
        @InjectRepository(MuestrasLabClinicoEntity)
        private readonly muestrasLabClinicoRepository: MuestrasLabClinicoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService

    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioMuestraLabClinicoEntity[]> {
        const cri_tom_mues = await this.criterioMuestraLabClinicoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'tom_mue_lab_clinico.mue_lab_cli_nombre_estandar'])
            .innerJoin('criterio.tom_mue_lab_clinico', 'tom_mue_lab_clinico')
            .where('tom_mue_lab_clinico.mue_lab_cli_id = :mues_est', { mues_est: id })
            .getMany()
        if (!cri_tom_mues) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_tom_mues
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioMuestraLabClinicoEntity[]> {
        const criterio = await this.criterioMuestraLabClinicoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO LAB CLINICO
    async create(mue_lab_cli_id: number, payloads: { dto: CriterioMuestraLabClinicoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const tomamuestras = await this.muestrasLabClinicoRepository.findOne({ where: { mue_lab_cli_id: mue_lab_cli_id } });
            if (!tomamuestras) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriotomamuestras = this.criterioMuestraLabClinicoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriotomamuestras.tom_mue_lab_clinico = tomamuestras

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

            await this.criterioMuestraLabClinicoRepository.save(criteriotomamuestras)
            await this.auditoria_registro_services.logCreateTomMuestrasLabClinico(
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

    //ENCONTRAR POR ID - CRITERIO LAB CLINICO
    async findById(cri_muest_cli_id: number): Promise<CriterioMuestraLabClinicoEntity> {
        const criterio_mue_lab_cli = await this.criterioMuestraLabClinicoRepository.findOne({ where: { cri_muest_cli_id } });
        if (!criterio_mue_lab_cli) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_mue_lab_cli;
    }

    //ELIMINAR CRITERIO LAB CLINICO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_mue_lab_cli = await this.findById(id);

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
            await this.criterioMuestraLabClinicoRepository.delete(criterio_mue_lab_cli.cri_muest_cli_id)
            await this.auditoria_eliminacion_services.logDeleteTomMuestrasLabClinico(
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

    //ACTUALIZAR CRITERIOS TOMA MUESTAS LAB CLINICO
    async update(id: number, payloads: { dto: CriterioMuestraLabClinicoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_tom_muestras = await this.findById(id);
            if (!criterio_tom_muestras) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_muest_cli_modalidad ? criterio_tom_muestras.cri_muest_cli_modalidad = dto.cri_muest_cli_modalidad : criterio_tom_muestras.cri_muest_cli_modalidad = criterio_tom_muestras.cri_muest_cli_modalidad;
            dto.cri_muest_cli_complejidad ? criterio_tom_muestras.cri_muest_cli_complejidad = dto.cri_muest_cli_complejidad : criterio_tom_muestras.cri_muest_cli_complejidad = criterio_tom_muestras.cri_muest_cli_complejidad;
            criterio_tom_muestras.cri_muest_cli_articulo = dto.cri_muest_cli_articulo !== undefined ? dto.cri_muest_cli_articulo : "";
            dto.cri_muest_cli_nombre_criterio ? criterio_tom_muestras.cri_muest_cli_nombre_criterio = dto.cri_muest_cli_nombre_criterio : criterio_tom_muestras.cri_muest_cli_nombre_criterio = criterio_tom_muestras.cri_muest_cli_nombre_criterio;

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

            await this.criterioMuestraLabClinicoRepository.save(criterio_tom_muestras);
            await this.auditoria_actualizacion_services.logUpdateTomMuestrasLabClinico(
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
