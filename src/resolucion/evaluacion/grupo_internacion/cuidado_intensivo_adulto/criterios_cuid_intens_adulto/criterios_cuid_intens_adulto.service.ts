import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioCuidIntensAdultoEntity } from '../criterio_cuid_intens_adulto.entity';
import { CuidIntAdultoEntity } from '../cuid_intens_adulto.entity';
import { CriterioCuidIntensAdultoRepository } from '../criterio_cuid_intens_adulto.repository';
import { CuidIntAdultoRepository } from '../cuid_intens_adulto.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntensAdultoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_adulto_dto/criterio_cuid_intens_adulto.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosCuidIntensAdultoService {

    constructor(
        @InjectRepository(CriterioCuidIntensAdultoEntity)
        private readonly criterioCuidIntensAdultoRepository: CriterioCuidIntensAdultoRepository,
        @InjectRepository(CuidIntAdultoEntity)
        private readonly cuidIntAdultoRepository: CuidIntAdultoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }

    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioCuidIntensAdultoEntity[]> {
        const cri_cui_ite_adu = await this.criterioCuidIntensAdultoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cuid_int_adulto.cuid_int_adult_nombre_estandar'])
            .innerJoin('criterio.cuid_int_adulto', 'cuid_int_adulto')
            .where('cuid_int_adulto.cuid_int_adult_id = :cui_int_adu_est', { cui_int_adu_est: id })
            .getMany()
        if (!cri_cui_ite_adu) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_cui_ite_adu
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioCuidIntensAdultoEntity[]> {
        const criterio = await this.criterioCuidIntensAdultoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(cuid_int_adult_id: number, payloads: { dto: CriterioCuidIntensAdultoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const cuiintensadul = await this.cuidIntAdultoRepository.findOne({ where: { cuid_int_adult_id: cuid_int_adult_id } });
            if (!cuiintensadul) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioscuiintensadul = this.criterioCuidIntensAdultoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioscuiintensadul.cuid_int_adulto = cuiintensadul

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

            await this.criterioCuidIntensAdultoRepository.save(criterioscuiintensadul)
            await this.auditoria_registro_services.logCreateIntenAdulto(
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

    //ENCONTRAR POR ID - CRITERIO CUIDADO INTENSIVO ADULTO  
    async findById(cri_int_adult_id: number): Promise<CriterioCuidIntensAdultoEntity> {
        const criterio_int_adult = await this.criterioCuidIntensAdultoRepository.findOne({ where: { cri_int_adult_id } });
        if (!criterio_int_adult) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_int_adult;
    }

    //ELIMINAR CRITERIO  CUIDADO INTENSIVO ADULTO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_int_adult = await this.findById(id);

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
            await this.criterioCuidIntensAdultoRepository.delete(criterio_int_adult.cri_int_adult_id)
            await this.auditoria_eliminacion_services.logDeleteIntenAdulto(
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

    //ACTUALIZAR CRITERIOS CUIDADO INTENSIVO ADULTO
    async update(id: number, payloads: { dto: CriterioCuidIntensAdultoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_cuid_intens_adulto = await this.findById(id);
            if (!criterio_cuid_intens_adulto) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_int_adult_modalidad ? criterio_cuid_intens_adulto.cri_int_adult_modalidad = dto.cri_int_adult_modalidad : criterio_cuid_intens_adulto.cri_int_adult_modalidad = criterio_cuid_intens_adulto.cri_int_adult_modalidad;
            dto.cri_int_adult_complejidad ? criterio_cuid_intens_adulto.cri_int_adult_complejidad = dto.cri_int_adult_complejidad : criterio_cuid_intens_adulto.cri_int_adult_complejidad = criterio_cuid_intens_adulto.cri_int_adult_complejidad;
            criterio_cuid_intens_adulto.cri_int_adult_articulo = dto.cri_int_adult_articulo !== undefined ? dto.cri_int_adult_articulo : "";
            dto.cri_int_adult_nombre_criterio ? criterio_cuid_intens_adulto.cri_int_adult_nombre_criterio = dto.cri_int_adult_nombre_criterio : criterio_cuid_intens_adulto.cri_int_adult_nombre_criterio = criterio_cuid_intens_adulto.cri_int_adult_nombre_criterio;

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

            await this.criterioCuidIntensAdultoRepository.save(criterio_cuid_intens_adulto);
            await this.auditoria_actualizacion_services.logUpdateIntenAdulto(
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
