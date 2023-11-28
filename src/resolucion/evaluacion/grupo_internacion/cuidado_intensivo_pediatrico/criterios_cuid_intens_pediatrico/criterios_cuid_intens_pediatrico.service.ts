import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioCuidIntePediatricoEntity } from '../criterio_cuid_intens_pediatrico.entity';
import { CuidIntePediatricoEntity } from '../cuid_intens_pediatrico.entity';
import { CriterioCuidIntePediatricoRepository } from '../criterio_cuid_intens_pediatrico.repository';
import { CuidIntePediatricoRepository } from '../cuid_intens_pediatrico.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntePediatricoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_pediatrico_dto/criterio_cuid_intens_pediatrico.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosCuidIntensPediatricoService {

    constructor(
        @InjectRepository(CriterioCuidIntePediatricoEntity)
        private readonly criterioCuidIntePediatricoRepository: CriterioCuidIntePediatricoRepository,
        @InjectRepository(CuidIntePediatricoEntity)
        private readonly cuidIntePediatricoRepository: CuidIntePediatricoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioCuidIntePediatricoEntity[]> {
        const cri_cuid_pedi = await this.criterioCuidIntePediatricoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cuid_int_pediatrico.cuid_int_pedi_nombre_estandar'])
            .innerJoin('criterio.cuid_int_pediatrico', 'cuid_int_pediatrico')
            .where('cuid_int_pediatrico.cuid_int_pedi_id = :pedia_est', { pedia_est: id })
            .getMany()
        if (!cri_cuid_pedi) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_cuid_pedi
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioCuidIntePediatricoEntity[]> {
        const criterio = await this.criterioCuidIntePediatricoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(cuid_int_pedi_id: number, payloads: { dto: CriterioCuidIntePediatricoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const cuiintensnpedia = await this.cuidIntePediatricoRepository.findOne({ where: { cuid_int_pedi_id: cuid_int_pedi_id } });
            if (!cuiintensnpedia) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioscuiintensnpedia = this.criterioCuidIntePediatricoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioscuiintensnpedia.cuid_int_pediatrico = cuiintensnpedia

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

            await this.criterioCuidIntePediatricoRepository.save(criterioscuiintensnpedia)
            await this.auditoria_registro_services.logCreateIntenPediatrico(
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

    //ENCONTRAR POR ID - CRITERIO CUIDADO INTENSIVO PEDIATRICO  
    async findById(cri_int_ped_id: number): Promise<CriterioCuidIntePediatricoEntity> {
        const criterio_int_ped = await this.criterioCuidIntePediatricoRepository.findOne({ where: { cri_int_ped_id } });
        if (!criterio_int_ped) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_int_ped;
    }

    //ELIMINAR CRITERIO  CUIDADO INTENSIVO PEDIATRICO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_int_ped = await this.findById(id);

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
            await this.criterioCuidIntePediatricoRepository.delete(criterio_int_ped.cri_int_ped_id)
            await this.auditoria_eliminacion_services.logDeleteIntenPediatrico(
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

    //ACTUALIZAR CRITERIOS CUIDADO INTENSIVO PEDIATRICO
    async update(id: number, payloads: { dto: CriterioCuidIntePediatricoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_cuid_intens_pedi = await this.findById(id);
            if (!criterio_cuid_intens_pedi) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_int_ped_modalidad ? criterio_cuid_intens_pedi.cri_int_ped_modalidad = dto.cri_int_ped_modalidad : criterio_cuid_intens_pedi.cri_int_ped_modalidad = criterio_cuid_intens_pedi.cri_int_ped_modalidad;
            dto.cri_int_ped_complejidad ? criterio_cuid_intens_pedi.cri_int_ped_complejidad = dto.cri_int_ped_complejidad : criterio_cuid_intens_pedi.cri_int_ped_complejidad = criterio_cuid_intens_pedi.cri_int_ped_complejidad;
            criterio_cuid_intens_pedi.cri_int_ped_articulo = dto.cri_int_ped_articulo !== undefined ? dto.cri_int_ped_articulo : "";
            dto.cri_int_ped_nombre_criterio ? criterio_cuid_intens_pedi.cri_int_ped_nombre_criterio = dto.cri_int_ped_nombre_criterio : criterio_cuid_intens_pedi.cri_int_ped_nombre_criterio = criterio_cuid_intens_pedi.cri_int_ped_nombre_criterio;

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

            await this.criterioCuidIntePediatricoRepository.save(criterio_cuid_intens_pedi);
            await this.auditoria_actualizacion_services.logUpdateIntenPediatrico(
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
