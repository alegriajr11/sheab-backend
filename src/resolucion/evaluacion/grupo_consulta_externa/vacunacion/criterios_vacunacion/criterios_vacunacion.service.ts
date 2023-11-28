import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioVacunacionEntity } from '../criterio_vacunacion.entity';
import { VacunacionEntity } from '../vacunacion.entity';
import { CriterioVacunacionRepository } from '../criterio_vacunacion.repository';
import { VacunacionRepository } from '../vacunacion.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioVacunacionDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/vacunacion_dto/criterio_vacunacion.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class CriteriosVacunacionService {

    constructor(
        @InjectRepository(CriterioVacunacionEntity)
        private readonly criterioVacunacionRepository: CriterioVacunacionRepository,
        @InjectRepository(VacunacionEntity)
        private readonly vacunacionRepository: VacunacionRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioVacunacionEntity[]> {
        const cri_vacu = await this.criterioVacunacionRepository.createQueryBuilder('criterio')
            .select(['criterio', 'vacunacion.vac_nombre_estandar'])
            .innerJoin('criterio.vacunacion', 'vacunacion')
            .where('vacunacion.vac_id = :vacu_est', { vacu_est: id })
            .getMany()
        if (!cri_vacu) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_vacu
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioVacunacionEntity[]> {
        const criterio = await this.criterioVacunacionRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }


    //CREAR CRITERIO
    async create(vac_id: number, payloads: { dto: CriterioVacunacionDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const vacunacion = await this.vacunacionRepository.findOne({ where: { vac_id: vac_id } });
            if (!vacunacion) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriosvacunacion = this.criterioVacunacionRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriosvacunacion.vacunacion = vacunacion

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

            await this.criterioVacunacionRepository.save(criteriosvacunacion)
            await this.auditoria_registro_services.logCreateVacunacion(
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

    //ENCONTRAR POR ID - CRITERIO VACUNACION  
    async findById(crivac_id: number): Promise<CriterioVacunacionEntity> {
        const criterio_vacunacion = await this.criterioVacunacionRepository.findOne({ where: { crivac_id } });
        if (!criterio_vacunacion) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_vacunacion;
    }

    //ELIMINAR CRITERIO  VACUNACION
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_vacunacion = await this.findById(id);

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
            await this.criterioVacunacionRepository.delete(criterio_vacunacion.crivac_id)
            await this.auditoria_eliminacion_services.logDeleteVacunacion(
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

    //ACTUALIZAR CRITERIOS VACUNACION 
    async update(id: number, payloads: { dto: CriterioVacunacionDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_vacunacion = await this.findById(id);
            if (!criterio_vacunacion) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crivac_modalidad ? criterio_vacunacion.crivac_modalidad = dto.crivac_modalidad : criterio_vacunacion.crivac_modalidad = criterio_vacunacion.crivac_modalidad;
            dto.crivac_complejidad ? criterio_vacunacion.crivac_complejidad = dto.crivac_complejidad : criterio_vacunacion.crivac_complejidad = criterio_vacunacion.crivac_complejidad;
            criterio_vacunacion.crivac_articulo = dto.crivac_articulo !== undefined ? dto.crivac_articulo : "";
            dto.crivac_nombre_criterio ? criterio_vacunacion.crivac_nombre_criterio = dto.crivac_nombre_criterio : criterio_vacunacion.crivac_nombre_criterio = criterio_vacunacion.crivac_nombre_criterio;
    
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

            await this.criterioVacunacionRepository.save(criterio_vacunacion);;
            await this.auditoria_actualizacion_services.logUpdateVacunacion(
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
