import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioExternaGeneralEntity } from '../criterio_ext_general.entity';
import { CriterioExternaGeneralRepository } from '../criterio_ext_general.repository';
import { ExternaGeneralEntity } from '../general.entity';
import { ExternaGeneralRepository } from '../general.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioExternaGeneralDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/externa_general_dto/criterio_ext_general.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosExtGeneralService {


    constructor(
        @InjectRepository(CriterioExternaGeneralEntity)
        private readonly criterioExternaGeneralRepository: CriterioExternaGeneralRepository,
        @InjectRepository(ExternaGeneralEntity)
        private readonly externaGeneralRepository: ExternaGeneralRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioExternaGeneralEntity[]> {
        const cri_ext_gen = await this.criterioExternaGeneralRepository.createQueryBuilder('criterio')
            .select(['criterio', 'externa_general.extg_nombre_estandar'])
            .innerJoin('criterio.externa_general', 'externa_general')
            .where('externa_general.extg_id = :exte_est', { exte_est: id })
            .getMany()
        if (!cri_ext_gen) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_ext_gen
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioExternaGeneralEntity[]> {
        const criterio = await this.criterioExternaGeneralRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(extg_id: number, payloads: { dto: CriterioExternaGeneralDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const externagene = await this.externaGeneralRepository.findOne({ where: { extg_id: extg_id } });
            if (!externagene) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioexternagene = this.criterioExternaGeneralRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioexternagene.externa_general = externagene

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

            await this.criterioExternaGeneralRepository.save(criterioexternagene)
            await this.auditoria_registro_services.logCreateExterGeneral(
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

    //ENCONTRAR POR ID - CRITERIO EXTERNA GENERAL  
    async findById(criextg_id: number): Promise<CriterioExternaGeneralEntity> {
        const criterio_ext_gene = await this.criterioExternaGeneralRepository.findOne({ where: { criextg_id } });
        if (!criterio_ext_gene) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_ext_gene;
    }

    //ELIMINAR CRITERIO  EXTERNA GENERAL 
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_ext_gene = await this.findById(id);

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
            await this.criterioExternaGeneralRepository.delete(criterio_ext_gene.criextg_id)
            await this.auditoria_eliminacion_services.logDeleteExterGeneral(
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

    //ACTUALIZAR CRITERIOS EXTERNA GENERAL 
    async update(id: number, payloads: { dto: CriterioExternaGeneralDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_ext_gene = await this.findById(id);
            if (!criterio_ext_gene) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.criextg_modalidad ? criterio_ext_gene.criextg_modalidad = dto.criextg_modalidad : criterio_ext_gene.criextg_modalidad = criterio_ext_gene.criextg_modalidad;
            dto.criextg_complejidad ? criterio_ext_gene.criextg_complejidad = dto.criextg_complejidad : criterio_ext_gene.criextg_complejidad = criterio_ext_gene.criextg_complejidad;
            criterio_ext_gene.criextg_articulo = dto.criextg_articulo !== undefined ? dto.criextg_articulo : "";
            dto.criextg_nombre_criterio ? criterio_ext_gene.criextg_nombre_criterio = dto.criextg_nombre_criterio : criterio_ext_gene.criextg_nombre_criterio = criterio_ext_gene.criextg_nombre_criterio;

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

            await this.criterioExternaGeneralRepository.save(criterio_ext_gene);
            await this.auditoria_actualizacion_services.logUpdateExterGeneral(
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
