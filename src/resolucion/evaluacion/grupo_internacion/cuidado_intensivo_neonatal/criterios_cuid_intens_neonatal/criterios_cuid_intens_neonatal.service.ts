import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioCuidInteNeonatalEntity } from '../criterio_cuid_intens_neonatal.entity';
import { CuidInteNeonatalEntity } from '../cuid_intens_neonatal.entity';
import { CriterioCuidInteNeonatalRepository } from '../criterio_cuid_intens_neonatal.repository';
import { CuidInteNeonatalRepository } from '../cuid_intens_neonatal.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidInteNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_neonatal_dto/criterio_cuid_intens_neonatal.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosCuidIntensNeonatalService {

    constructor(
        @InjectRepository(CriterioCuidInteNeonatalEntity)
        private readonly criterioCuidInteNeonatalRepository: CriterioCuidInteNeonatalRepository,
        @InjectRepository(CuidInteNeonatalEntity)
        private readonly cuidInteNeonatalRepository: CuidInteNeonatalRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioCuidInteNeonatalEntity[]> {
        const cri_itens_neo = await this.criterioCuidInteNeonatalRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cuid_int_neonatal.cuid_int_neona_nombre_estandar'])
            .innerJoin('criterio.cuid_int_neonatal', 'cuid_int_neonatal')
            .where('cuid_int_neonatal.cuid_int_neona_id = :intes_neo_est', { intes_neo_est: id })
            .getMany()
        if (!cri_itens_neo) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_itens_neo
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioCuidInteNeonatalEntity[]> {
        const criterio = await this.criterioCuidInteNeonatalRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

     //CREAR CRITERIO
    async create(cuid_int_neona_id: number, payloads: { dto: CriterioCuidInteNeonatalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const cuiintensneo = await this.cuidInteNeonatalRepository.findOne({ where: { cuid_int_neona_id: cuid_int_neona_id } });
            if (!cuiintensneo) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioscuiintensneo = this.criterioCuidInteNeonatalRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioscuiintensneo.cuid_int_neonatal = cuiintensneo

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

            await this.criterioCuidInteNeonatalRepository.save(criterioscuiintensneo)
            await this.auditoria_registro_services.logCreateIntenNeonatal(
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

    //ENCONTRAR POR ID - CRITERIO CUIDADO INTENSIVO NEONATAL  
    async findById(cri_neona_id: number): Promise<CriterioCuidInteNeonatalEntity> {
        const criterio_int_neona = await this.criterioCuidInteNeonatalRepository.findOne({ where: { cri_neona_id } });
        if (!criterio_int_neona) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_int_neona;
    }

    //ELIMINAR CRITERIO  CUIDADO INTENSIVO NEONATAL
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_int_neona = await this.findById(id);

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
            await this.criterioCuidInteNeonatalRepository.delete(criterio_int_neona.cri_neona_id)
            await this.auditoria_eliminacion_services.logDeleteIntenNeonatal(
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

    //ACTUALIZAR CRITERIOS CUIDADO INTENSIVO NEONATAL
    async update(id: number, payloads: { dto: CriterioCuidInteNeonatalDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_cuid_intens_neo = await this.findById(id);
            if (!criterio_cuid_intens_neo) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_neona_modalidad ? criterio_cuid_intens_neo.cri_neona_modalidad = dto.cri_neona_modalidad : criterio_cuid_intens_neo.cri_neona_modalidad = criterio_cuid_intens_neo.cri_neona_modalidad;
            dto.cri_neona_complejidad ? criterio_cuid_intens_neo.cri_neona_complejidad = dto.cri_neona_complejidad : criterio_cuid_intens_neo.cri_neona_complejidad = criterio_cuid_intens_neo.cri_neona_complejidad;
            criterio_cuid_intens_neo.cri_neona_articulo = dto.cri_neona_articulo !== undefined ? dto.cri_neona_articulo : "";
            dto.cri_neona_nombre_criterio ? criterio_cuid_intens_neo.cri_neona_nombre_criterio = dto.cri_neona_nombre_criterio : criterio_cuid_intens_neo.cri_neona_nombre_criterio = criterio_cuid_intens_neo.cri_neona_nombre_criterio;
    
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

            await this.criterioCuidInteNeonatalRepository.save(criterio_cuid_intens_neo);
            await this.auditoria_actualizacion_services.logUpdateIntenNeonatal(
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

