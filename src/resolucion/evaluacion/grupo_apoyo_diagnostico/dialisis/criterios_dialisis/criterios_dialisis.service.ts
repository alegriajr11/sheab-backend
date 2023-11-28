import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioDialisisEntity } from '../criterio_dialisis.entity';
import { CriterioDialisisRepository } from '../criterio_dialisis.repository';
import { MessageDto } from 'src/common/message.dto';
import { DialisisEntity } from '../dialisis.entity';
import { DialisisRepository } from '../dialisis.repository';
import { CriterioDialisisDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/dialisis_dto/criterio_dialisis.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosDialisisService {

    constructor(
        @InjectRepository(CriterioDialisisEntity)
        private readonly criterioDialisisRepository: CriterioDialisisRepository,
        @InjectRepository(DialisisEntity)
        private readonly dialisisRepository: DialisisRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioDialisisEntity[]> {
        const cri_dialisis = await this.criterioDialisisRepository.createQueryBuilder('criterio')
            .select(['criterio', 'dialisis.dial_nombre_estandar'])
            .innerJoin('criterio.dialisis', 'dialisis')
            .where('dialisis.dial_id = :dial_est', { dial_est: id })
            .getMany()
        if (!cri_dialisis) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_dialisis

    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioDialisisEntity[]> {
        const criterio = await this.criterioDialisisRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }


    //METODO AGREGAR CRITERIO-DIALISIS
    async createCriDialisis(dial_id: number, payloads: { dto: CriterioDialisisDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const dialisis = await this.dialisisRepository.findOne({ where: { dial_id: dial_id } });
            if (!dialisis) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterio_dialisis = this.criterioDialisisRepository.create(dto);

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterio_dialisis.dialisis = dialisis;

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioDialisisRepository.save(criterio_dialisis);
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

            await this.criterioDialisisRepository.save(criterio_dialisis);
            await this.auditoria_registro_services.logCreateDialisis(
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

    //ENCONTRAR POR ID - CRITERIO DIALISIS
    async findById(cridial_id: number): Promise<CriterioDialisisEntity> {
        const cri_dialisis = await this.criterioDialisisRepository.findOne({ where: { cridial_id } });
        if (!cri_dialisis) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_dialisis;
    }

    //ELIMINAR CRITERIO DIALISIS
    async delete(id: number, tokenDto: TokenDto ): Promise<any> {
        try {
            const criterio_dialisis = await this.findById(id);

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
            await this.criterioDialisisRepository.delete(criterio_dialisis.cridial_id)
            await this.auditoria_eliminacion_services.logDeleteDialisis(
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

    //ACTUALIZAR CRITERIOS DIALISIS
    async updateDialisis(id: number, payloads: { dto: CriterioDialisisDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_dialisis = await this.findById(id);
            if (!criterio_dialisis) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cridial_modalidad ? criterio_dialisis.cridial_modalidad = dto.cridial_modalidad : criterio_dialisis.cridial_modalidad = criterio_dialisis.cridial_modalidad;
            dto.cridial_complejidad ? criterio_dialisis.cridial_complejidad = dto.cridial_complejidad : criterio_dialisis.cridial_complejidad = criterio_dialisis.cridial_complejidad;
            criterio_dialisis.cridial_articulo = dto.cridial_articulo !== undefined ? dto.cridial_articulo : "";
            dto.cridial_nombre_criterio ? criterio_dialisis.cridial_nombre_criterio = dto.cridial_nombre_criterio : criterio_dialisis.cridial_nombre_criterio = criterio_dialisis.cridial_nombre_criterio;
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

            await this.criterioDialisisRepository.save(criterio_dialisis);
            await this.auditoria_actualizacion_services.logUpdateDialisis(
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
