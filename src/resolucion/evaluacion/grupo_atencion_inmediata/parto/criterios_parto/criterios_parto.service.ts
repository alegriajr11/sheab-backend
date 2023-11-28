import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioPartoEntity } from '../criterio_parto.entity';
import { PartoEntity } from '../parto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PartoRepository } from '../parto.repository';
import { CriterioPartoRepository } from '../criterio_parto.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioPartoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/parto_dto/criterio_parto.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosPartoService {

    constructor(
        @InjectRepository(CriterioPartoEntity)
        private readonly criterioPartoRepository: CriterioPartoRepository,
        @InjectRepository(PartoEntity)
        private readonly partoRepository: PartoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioPartoEntity[]> {
        const cri_parto = await this.criterioPartoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'parto.parto_nombre_estandar'])
            .innerJoin('criterio.parto', 'parto')
            .where('parto.parto_id = :part_est', { part_est: id })
            .getMany()
        if (!cri_parto) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_parto
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioPartoEntity[]> {
        const criterio = await this.criterioPartoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO PARTO
    async create(parto_id: number, payloads: { dto: CriterioPartoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const parto = await this.partoRepository.findOne({ where: { parto_id: parto_id } });
            if (!parto) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioparto = this.criterioPartoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioparto.parto = parto

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

            await this.criterioPartoRepository.save(criterioparto)
            await this.auditoria_registro_services.logCreateParto(
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

    //ENCONTRAR POR ID - CRITERIO PARTO  
    async findById(criparto_id: number): Promise<CriterioPartoEntity> {
        const criterio_parto = await this.criterioPartoRepository.findOne({ where: { criparto_id } });
        if (!criterio_parto) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_parto;
    }

    //ELIMINAR CRITERIO PARTO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_parto = await this.findById(id);

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
            await this.criterioPartoRepository.delete(criterio_parto.criparto_id)
            await this.auditoria_eliminacion_services.logDeleteParto(
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

    //ACTUALIZAR CRITERIOS PARTO
    async update(id: number, payloads: { dto: CriterioPartoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_parto = await this.findById(id);
            if (!criterio_parto) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.criparto_modalidad ? criterio_parto.criparto_modalidad = dto.criparto_modalidad : criterio_parto.criparto_modalidad = criterio_parto.criparto_modalidad;
            dto.criparto_complejidad ? criterio_parto.criparto_complejidad = dto.criparto_complejidad : criterio_parto.criparto_complejidad = criterio_parto.criparto_complejidad;
            criterio_parto.criparto_articulo = dto.criparto_articulo !== undefined ? dto.criparto_articulo : "";
            dto.criparto_nombre_criterio ? criterio_parto.criparto_nombre_criterio = dto.criparto_nombre_criterio : criterio_parto.criparto_nombre_criterio = criterio_parto.criparto_nombre_criterio;

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

            await this.criterioPartoRepository.save(criterio_parto);
            await this.auditoria_actualizacion_services.logUpdateParto(
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
