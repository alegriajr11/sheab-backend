import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioPatologiaEntity } from '../criterio_patologia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioPatologiaRepository } from '../criterio_patologia.repository';
import { PatologiaEntity } from '../patologia.entity';
import { PatologiaRepository } from '../patologia.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioPatologiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/patologia_dto/criterio_patologia.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosPatologiaService {

    constructor(
        @InjectRepository(CriterioPatologiaEntity)
        private readonly criterioPatologiaRepository: CriterioPatologiaRepository,
        @InjectRepository(PatologiaEntity)
        private readonly patologiaRepository: PatologiaRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioPatologiaEntity[]> {
        const cri_pato = await this.criterioPatologiaRepository.createQueryBuilder('criterio')
            .select(['criterio', 'patologia.pato_nombre_estandar'])
            .innerJoin('criterio.patologia', 'patologia')
            .where('patologia.pato_id = :pato_est', { pato_est: id })
            .getMany()
        if (!cri_pato) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_pato
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioPatologiaEntity[]> {
        const criterio = await this.criterioPatologiaRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIOS PATOLOGIA
    async create(pato_id: number, payloads: { dto: CriterioPatologiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const patologia = await this.patologiaRepository.findOne({ where: { pato_id: pato_id } });
            if (!patologia) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriopatologia = this.criterioPatologiaRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriopatologia.patologia = patologia

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioPatologiaRepository.save(criteriopatologia)
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

            await this.auditoria_registro_services.logCreatePatologia(
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

    //ENCONTRAR POR ID - CRITERIO PATOLOGIA
    async findById(cripat_id: number): Promise<CriterioPatologiaEntity> {
        const cri_pato = await this.criterioPatologiaRepository.findOne({ where: { cripat_id } });
        if (!cri_pato) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_pato;
    }

    //ELIMINAR CRITERIO PATOLOGIA
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const cri_pato = await this.findById(id);

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
            await this.criterioPatologiaRepository.delete(cri_pato.cripat_id)
            await this.auditoria_eliminacion_services.logDeletePatologia(
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

    //ACTUALIZAR CRITERIOS PATOLOGIA
    async update(id: number, payloads: { dto: CriterioPatologiaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_patologia = await this.findById(id);
            if (!criterio_patologia) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cripat_modalidad ? criterio_patologia.cripat_modalidad = dto.cripat_modalidad : criterio_patologia.cripat_modalidad = criterio_patologia.cripat_modalidad;
            dto.cripat_complejidad ? criterio_patologia.cripat_complejidad = dto.cripat_complejidad : criterio_patologia.cripat_complejidad = criterio_patologia.cripat_complejidad;
            criterio_patologia.cripat_articulo = dto.cripat_articulo !== undefined ? dto.cripat_articulo : "";
            dto.cripat_nombre_criterio ? criterio_patologia.cripat_nombre_criterio = dto.cripat_nombre_criterio : criterio_patologia.cripat_nombre_criterio = criterio_patologia.cripat_nombre_criterio;

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

            await this.criterioPatologiaRepository.save(criterio_patologia);
            await this.auditoria_actualizacion_services.logUpdatePatologia(
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
