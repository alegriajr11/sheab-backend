import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Criterio_servicios } from '../servicios/criterio_servicios.entity';
import { TodoServiciosEntity } from '../servicios/todos_servicios.entity';
import { CriterioServiciosRepository } from '../servicios/criterio_servicios.repository';
import { TodoServiciosRepository } from '../servicios/todos_servicios.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioServiciosDto } from 'src/resolucion/dtos/evaluacion_dtos/todos_servicios_dto/servicios_dto/criterio_servicios.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriterioServiciosService {

    constructor(
        @InjectRepository(Criterio_servicios)
        private readonly criterioServiciosRepository: CriterioServiciosRepository,
        @InjectRepository(TodoServiciosEntity)
        private readonly todoServiciosRepository: TodoServiciosRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService

    ) { }

    //LISTANDO TODOS LOS ESTANDARES DEL GRUPO TODOS LOS SERVICIOS
    async getAllEstandarServicios(): Promise<TodoServiciosEntity[]> {
        const estandar = await this.todoServiciosRepository.find()
        if (!estandar) throw new NotFoundException(new MessageDto('No hay Estandares Todos los Servicios en la lista'))
        return estandar;
    }

    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<Criterio_servicios[]> {
        const cri_serv = await this.criterioServiciosRepository.createQueryBuilder('criterio')
            .select(['criterio', 'todos_servicios.tod_nombre_estandar'])
            .innerJoin('criterio.todos_servicios', 'todos_servicios')
            .innerJoinAndSelect('criterio.todos_servi_seccion', 'todos_servi_seccion')
            .innerJoinAndSelect('criterio.todos_servi_aparto', 'todos_servi_aparto')
            .where('todos_servicios.tod_id = :tod_ser_est', { tod_ser_est: id })
            .getMany()
        if (!cri_serv) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_serv
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<Criterio_servicios[]> {
        const criterio = await this.criterioServiciosRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .innerJoinAndSelect('criterios.todos_servi_seccion', 'todos_servi_seccion')
            .innerJoinAndSelect('criterios.todos_servi_aparto', 'todos_servi_aparto')
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(tod_id: number, payloads: { dto: CriterioServiciosDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const servicios = await this.todoServiciosRepository.findOne({ where: { tod_id: tod_id } });
            if (!servicios) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriosserviciosa = this.criterioServiciosRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriosserviciosa.todos_servicios = servicios

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

            await this.criterioServiciosRepository.save(criteriosserviciosa);
            await this.auditoria_registro_services.logCreateTodosServicios(
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

    //ENCONTRAR POR ID - CRITERIO TODOS LOS SERVICIOS
    async findById(cris_id: number): Promise<Criterio_servicios> {
        const criterio_servicios = await this.criterioServiciosRepository.findOne({ where: { cris_id } });
        if (!criterio_servicios) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_servicios;
    }

    //ELIMINAR CRITERIO  TODOS LOS SERVICIOS
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_servicios = await this.findById(id);

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
            await this.criterioServiciosRepository.delete(criterio_servicios.cris_id);
            await this.auditoria_eliminacion_services.logDeleteTodosServicios(
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

    //ACTUALIZAR CRITERIOS CUIDADO  TODOS LOS SERVICIOS
    async update(id: number, payloads: { dto: CriterioServiciosDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_servicios = await this.findById(id);
            if (!criterio_servicios) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cris_modalidad ? criterio_servicios.cris_modalidad = dto.cris_modalidad : criterio_servicios.cris_modalidad = criterio_servicios.cris_modalidad;
            criterio_servicios.cris_articulo = dto.cris_articulo !== undefined ? dto.cris_articulo : "";
            dto.cris_nombre_criterio ? criterio_servicios.cris_nombre_criterio = dto.cris_nombre_criterio : criterio_servicios.cris_nombre_criterio = criterio_servicios.cris_nombre_criterio;

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

            await this.criterioServiciosRepository.save(criterio_servicios);
            await this.auditoria_actualizacion_services.logUpdateConsumoPsicoactivas(
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
