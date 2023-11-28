import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioLabClinicoEntity } from '../criterio_lab_clinico.entity';
import { LabClinicoEntity } from '../laboratorio_clinico.entity';
import { CriterioLabClinicoRepository } from '../criterio_lab_clinico.repository';
import { LabClinicoRepository } from '../laboratorio_clinico.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioLabClinicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_clinico_dto/criterio_lab_clinico.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosLabClinicoService {

    constructor(
        @InjectRepository(CriterioLabClinicoEntity)
        private readonly criterioLabClinicoRepository: CriterioLabClinicoRepository,
        @InjectRepository(LabClinicoEntity)
        private readonly labClinicoRepository: LabClinicoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioLabClinicoEntity[]> {
        const cri_lab_clin = await this.criterioLabClinicoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'lab_clinico.labclin_nombre_estandar'])
            .innerJoin('criterio.lab_clinico', 'lab_clinico')
            .where('lab_clinico.labclin_id = :lab_cli_est', { lab_cli_est: id })
            .getMany()
        if (!cri_lab_clin) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_lab_clin
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioLabClinicoEntity[]> {
        const criterio = await this.criterioLabClinicoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //METODO AGREGAR CRITERIO-LABORATORIO CLINICO
    async create(labclin_id: number, payloads: { dto: CriterioLabClinicoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const labclinico = await this.labClinicoRepository.findOne({ where: { labclin_id: labclin_id } });
            if (!labclinico) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriolabclinico = this.criterioLabClinicoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriolabclinico.lab_clinico = labclinico

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioLabClinicoRepository.save(criteriolabclinico)
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
            await this.auditoria_registro_services.logCreateLabClinico(
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

    //ENCONTRAR POR ID - CRITERIO LABORATORIO CLINICO
    async findById(cri_lab_cli_id: number): Promise<CriterioLabClinicoEntity> {
        const cri_lab_cli = await this.criterioLabClinicoRepository.findOne({ where: { cri_lab_cli_id } });
        if (!cri_lab_cli) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_lab_cli;
    }

    //ELIMINAR CRITERIO LABORATORIO CLINICO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const cri_lab_cli = await this.findById(id);

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
            await this.criterioLabClinicoRepository.delete(cri_lab_cli.cri_lab_cli_id)
            await this.auditoria_eliminacion_services.logDeleteLabClinico(
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

    //ACTUALIZAR CRITERIOS  CITOLOGIAS CLINICO
    async update(id: number, payloads: { dto: CriterioLabClinicoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_lab_clinico = await this.findById(id);
            if (!criterio_lab_clinico) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_lab_cli_modalidad ? criterio_lab_clinico.cri_lab_cli_modalidad = dto.cri_lab_cli_modalidad : criterio_lab_clinico.cri_lab_cli_modalidad = criterio_lab_clinico.cri_lab_cli_modalidad;
            dto.cri_lab_cli_complejidad ? criterio_lab_clinico.cri_lab_cli_complejidad = dto.cri_lab_cli_complejidad : criterio_lab_clinico.cri_lab_cli_complejidad = criterio_lab_clinico.cri_lab_cli_complejidad;
            criterio_lab_clinico.cri_lab_cli_articulo = dto.cri_lab_cli_articulo !== undefined ? dto.cri_lab_cli_articulo : "";
            dto.cri_lab_cli_nombre_criterio ? criterio_lab_clinico.cri_lab_cli_nombre_criterio = dto.cri_lab_cli_nombre_criterio : criterio_lab_clinico.cri_lab_cli_nombre_criterio = criterio_lab_clinico.cri_lab_cli_nombre_criterio;

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

            await this.criterioLabClinicoRepository.save(criterio_lab_clinico);
            await this.auditoria_actualizacion_services.logUpdateLabClinico(
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
