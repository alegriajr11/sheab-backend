import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioCuidIntermPediatricoEntity } from '../criterio_cuid_inter_pediatrico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CuidIntermPediatricoEntity } from '../cuid_inter_pediatrico.entity';
import { CriterioCuidIntermPediatricoRepository } from '../criterio_cuid_inter_pediatrico.repository';
import { CuidIntermPediatricoRepository } from '../cuid_inter_pediatrico.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntermPediatricoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_pediatrico_dto/criterio_cuid_inter_pediatrico.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { TokenDto } from 'src/auth/dto/token.dto';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';




@Injectable()
export class CriteriosCuidInterPediatricoService {

    constructor(
        @InjectRepository(CriterioCuidIntermPediatricoEntity)
        private readonly criterioCuidIntermPediatricoRepository: CriterioCuidIntermPediatricoRepository,
        @InjectRepository(CuidIntermPediatricoEntity)
        private readonly cuidIntermPediatricoRepository: CuidIntermPediatricoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioCuidIntermPediatricoEntity[]> {
        const cri_cuid_ped = await this.criterioCuidIntermPediatricoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cuid_inter_pediatrico.cuid_inter_pedi_nombre_estandar'])
            .innerJoin('criterio.cuid_inter_pediatrico', 'cuid_inter_pediatrico')
            .where('cuid_inter_pediatrico.cuid_inter_pedi_id = :cui_pedi_est', { cui_pedi_est: id })
            .getMany()
        if (!cri_cuid_ped) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_cuid_ped
    }


    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioCuidIntermPediatricoEntity[]> {
        const criterio = await this.criterioCuidIntermPediatricoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }


    //CREAR CRITERIO
    async create(cuid_inter_pedi_id: number, payloads: { dto: CriterioCuidIntermPediatricoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const cuidinterpedi = await this.cuidIntermPediatricoRepository.findOne({ where: { cuid_inter_pedi_id: cuid_inter_pedi_id } });
            if (!cuidinterpedi) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioscuidinterpedi = this.criterioCuidIntermPediatricoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioscuidinterpedi.cuid_inter_pediatrico = cuidinterpedi

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

            await this.criterioCuidIntermPediatricoRepository.save(criterioscuidinterpedi)
            await this.auditoria_registro_services.logCreateInterPediatrico(
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

    //ENCONTRAR POR ID - CRITERIO CUIDADO  INTERMEDIO PEDIATRICO
    async findById(cri_inter_pedia_id: number): Promise<CriterioCuidIntermPediatricoEntity> {
        const criterio_inter_pedia = await this.criterioCuidIntermPediatricoRepository.findOne({ where: { cri_inter_pedia_id } });
        if (!criterio_inter_pedia) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_inter_pedia;
    }

    //ELIMINAR CRITERIO  CUIDADO  INTERMEDIO PEDIATRICO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_inter_pedia = await this.findById(id);

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
            await this.criterioCuidIntermPediatricoRepository.delete(criterio_inter_pedia.cri_inter_pedia_id)
            await this.auditoria_eliminacion_services.logDeleteInterPediatrico(
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

    

    async update(id: number, payloads: { dto: CriterioCuidIntermPediatricoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_cuid_inter_pedi = await this.findById(id);
            if (!criterio_cuid_inter_pedi) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_inter_pedia_modalidad ? criterio_cuid_inter_pedi.cri_inter_pedia_modalidad = dto.cri_inter_pedia_modalidad : criterio_cuid_inter_pedi.cri_inter_pedia_modalidad = criterio_cuid_inter_pedi.cri_inter_pedia_modalidad;
            dto.cri_inter_pedia_complejidad ? criterio_cuid_inter_pedi.cri_inter_pedia_complejidad = dto.cri_inter_pedia_complejidad : criterio_cuid_inter_pedi.cri_inter_pedia_complejidad = criterio_cuid_inter_pedi.cri_inter_pedia_complejidad;
            criterio_cuid_inter_pedi.cri_inter_pedia_articulo = dto.cri_inter_pedia_articulo !== undefined ? dto.cri_inter_pedia_articulo : "";
            dto.cri_inter_pedia_nombre_criterio ? criterio_cuid_inter_pedi.cri_inter_pedia_nombre_criterio = dto.cri_inter_pedia_nombre_criterio : criterio_cuid_inter_pedi.cri_inter_pedia_nombre_criterio = criterio_cuid_inter_pedi.cri_inter_pedia_nombre_criterio;

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

            await this.criterioCuidIntermPediatricoRepository.save(criterio_cuid_inter_pedi);
            await this.auditoria_actualizacion_services.logUpdateInterPediatrico(
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

