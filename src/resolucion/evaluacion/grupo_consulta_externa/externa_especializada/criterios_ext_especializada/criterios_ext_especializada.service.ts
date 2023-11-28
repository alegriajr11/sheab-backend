import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioEspecializadaEntity } from '../criterio_especializada.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternaEspecializadaEntity } from '../especializada.entity';
import { ExternaEspecializadaRepository } from '../especializada.repository';
import { CriterioEspecializadaRepository } from '../criterio_especializada.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioEspecializadaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/externa_especializada_dto/criterio_especializada.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class CriteriosExtEspecializadaService {

    constructor(
        @InjectRepository(CriterioEspecializadaEntity)
        private readonly criterioEspecializadaRepository: CriterioEspecializadaRepository,
        @InjectRepository(ExternaEspecializadaEntity)
        private readonly externaEspecializadaRepository: ExternaEspecializadaRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioEspecializadaEntity[]> {
        const cri_espe = await this.criterioEspecializadaRepository.createQueryBuilder('criterio')
            .select(['criterio', 'externa_especializada.exte_nombre_estandar'])
            .innerJoin('criterio.externa_especializada', 'externa_especializada')
            .where('externa_especializada.exte_id = :espe_est', { espe_est: id })
            .getMany()
        if (!cri_espe) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_espe
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioEspecializadaEntity[]> {
        const criterio = await this.criterioEspecializadaRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(exte_id: number, payloads: { dto: CriterioEspecializadaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const externaespec = await this.externaEspecializadaRepository.findOne({ where: { exte_id: exte_id } });
            if (!externaespec) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioexternaespec = this.criterioEspecializadaRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioexternaespec.externa_especializada = externaespec

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

            await this.criterioEspecializadaRepository.save(criterioexternaespec)
            await this.auditoria_registro_services.logCreateExterEspecializada(
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

    //ENCONTRAR POR ID - CRITERIO TRANSPORTE EXTERNA ESPECIALIZADA   
    async findById(criextg_id: number): Promise<CriterioEspecializadaEntity> {
        const criterio_ext_esp = await this.criterioEspecializadaRepository.findOne({ where: { criextg_id } });
        if (!criterio_ext_esp) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_ext_esp;
    }

    //ELIMINAR CRITERIO  EXTERNA ESPECIALIZADA 
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_ext_esp = await this.findById(id);

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
            await this.criterioEspecializadaRepository.delete(criterio_ext_esp.criextg_id)
            await this.auditoria_eliminacion_services.logDeleteExterEspecializada(
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

    //ACTUALIZAR CRITERIOS EXTERNA ESPECIALIZADA 
    async update(id: number, payloads: { dto: CriterioEspecializadaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_ext_esp = await this.findById(id);
            if (!criterio_ext_esp) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.criexte_modalidad ? criterio_ext_esp.criexte_modalidad = dto.criexte_modalidad : criterio_ext_esp.criexte_modalidad = criterio_ext_esp.criexte_modalidad;
            dto.criexte_complejidad ? criterio_ext_esp.criexte_complejidad = dto.criexte_complejidad : criterio_ext_esp.criexte_complejidad = criterio_ext_esp.criexte_complejidad;
            criterio_ext_esp.criexte_articulo = dto.criexte_articulo !== undefined ? dto.criexte_articulo : "";
            dto.criexte_nombre_criterio ? criterio_ext_esp.criexte_nombre_criterio = dto.criexte_nombre_criterio : criterio_ext_esp.criexte_nombre_criterio = criterio_ext_esp.criexte_nombre_criterio;

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

            await this.criterioEspecializadaRepository.save(criterio_ext_esp);
            await this.auditoria_actualizacion_services.logUpdateExterEspecializada(
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
