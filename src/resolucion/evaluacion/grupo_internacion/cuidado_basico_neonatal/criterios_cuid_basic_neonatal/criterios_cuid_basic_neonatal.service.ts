import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioCuidBasNeonatalEntity } from '../criterio_cuid_basic_neonatal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CuidBasNeonatalEntity } from '../cuid_basic_neonatal.entity';
import { CriterioCuidBasNeonatalRepository } from '../criterio_cuid_basic_neonatal.repository';
import { CuidBasNeonatalRepository } from '../cuid_basic_neonatal.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidBasNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_basico_neonatal_dto/criterio_cuid_basic_neonatal.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class CriteriosCuidBasicNeonatalService {

    constructor(
        @InjectRepository(CriterioCuidBasNeonatalEntity)
        private readonly criterioCuidBasNeonatalRepository: CriterioCuidBasNeonatalRepository,
        @InjectRepository(CuidBasNeonatalEntity)
        private readonly cuidBasNeonatalRepository: CuidBasNeonatalRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioCuidBasNeonatalEntity[]> {
        const cri_cui_neo = await this.criterioCuidBasNeonatalRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cuid_bas_neonatal.cuid_neona_nombre_estandar'])
            .innerJoin('criterio.cuid_bas_neonatal', 'cuid_bas_neonatal')
            .where('cuid_bas_neonatal.cuid_neona_id = :neo_est', { neo_est: id })
            .getMany()
        if (!cri_cui_neo) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_cui_neo
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioCuidBasNeonatalEntity[]> {
        const criterio = await this.criterioCuidBasNeonatalRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIOS 
    async create(cuid_neona_id: number, payloads: { dto: CriterioCuidBasNeonatalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const cuidadoneona = await this.cuidBasNeonatalRepository.findOne({ where: { cuid_neona_id: cuid_neona_id } });
            if (!cuidadoneona) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioscuidadoneona = this.criterioCuidBasNeonatalRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioscuidadoneona.cuid_bas_neonatal = cuidadoneona

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

            await this.criterioCuidBasNeonatalRepository.save(criterioscuidadoneona)
            await this.auditoria_registro_services.logCreateBasNeonatal(
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

    //ENCONTRAR POR ID - CRITERIO CUIDADO BASICO NEO  
    async findById(cri_neona_id: number): Promise<CriterioCuidBasNeonatalEntity> {
        const criterio_neona = await this.criterioCuidBasNeonatalRepository.findOne({ where: { cri_neona_id } });
        if (!criterio_neona) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_neona;
    }

    //ELIMINAR CRITERIO  CUIDADO BASICO NEO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_neona = await this.findById(id);

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
            await this.criterioCuidBasNeonatalRepository.delete(criterio_neona.cri_neona_id)
            await this.auditoria_eliminacion_services.logDeleteBasNeonatal(
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


    //ACTUALIZAR CRITERIOS CUIDADO BASICO NEO 
    async update(id: number, payloads: { dto: CriterioCuidBasNeonatalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_cuid_basic_neonatal = await this.findById(id);
            if (!criterio_cuid_basic_neonatal) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_neona_modalidad ? criterio_cuid_basic_neonatal.cri_neona_modalidad = dto.cri_neona_modalidad : criterio_cuid_basic_neonatal.cri_neona_modalidad = criterio_cuid_basic_neonatal.cri_neona_modalidad;
            dto.cri_neona_complejidad ? criterio_cuid_basic_neonatal.cri_neona_complejidad = dto.cri_neona_complejidad : criterio_cuid_basic_neonatal.cri_neona_complejidad = criterio_cuid_basic_neonatal.cri_neona_complejidad;
            criterio_cuid_basic_neonatal.cri_neona_articulo = dto.cri_neona_articulo !== undefined ? dto.cri_neona_articulo : "";
            dto.cri_neona_nombre_criterio ? criterio_cuid_basic_neonatal.cri_neona_nombre_criterio = dto.cri_neona_nombre_criterio : criterio_cuid_basic_neonatal.cri_neona_nombre_criterio = criterio_cuid_basic_neonatal.cri_neona_nombre_criterio;

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

            await this.criterioCuidBasNeonatalRepository.save(criterio_cuid_basic_neonatal);
            await this.auditoria_actualizacion_services.logUpdateBasNeonatal(
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
