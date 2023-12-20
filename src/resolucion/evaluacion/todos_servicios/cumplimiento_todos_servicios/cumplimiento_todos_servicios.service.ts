import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { Criterio_servicios } from '../servicios/criterio_servicios.entity';
import { CriterioServiciosRepository } from '../servicios/criterio_servicios.repository';
import { CumplimientoServiciosEntity } from '../servicios/cumplimiento_servicios.entity';
import { CumplimientoServiciosRepository } from '../servicios/cumplimiento_servicios.repository';
import { CumplimientoServiciosDto } from 'src/resolucion/dtos/evaluacion_dtos/todos_servicios_dto/servicios_dto/cumplimiento_servicios.dto';
import { EvaluacionResVerificacionEntity } from '../../evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from '../../evaluacion_resolucion_verificacion/evaluacion_res.repository';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/auth/payload.interface';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';


@Injectable()
export class CumplimientoTodosServiciosService {

    constructor(
        @InjectRepository(CumplimientoServiciosEntity)
        private readonly cumplimientoServiciosRepository: CumplimientoServiciosRepository,
        @InjectRepository(Criterio_servicios)
        private readonly criterioServiciosRepository: CriterioServiciosRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,

    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cumps_id: number): Promise<CumplimientoServiciosEntity> {
        const cumplimiento = await this.cumplimientoServiciosRepository.findOne({ where: { cumps_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }


    //METODO CREAR CUMPLIMIENTO
    async create(payloads: { dto: CumplimientoServiciosDto, tokenDto: TokenDto }): Promise<any> {
        try {

            const { dto, tokenDto } = payloads;
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

            const criterio = await this.criterioServiciosRepository.findOne({ where: { cris_id: dto.cris_id } });
            if (!criterio) {
                throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'));
            }

            const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: dto.eva_ver_id } });
            if (!evaluacion) {
                throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'));
            }

            // Creamos el DTO para transferir los datos
            const cumplimiento = this.cumplimientoServiciosRepository.create(dto);

            // Asignamos la evaluacion al cumplimiento
            cumplimiento.cump_eva_todos_servi = evaluacion;

            // Asignamos el criterio al cumplimiento
            cumplimiento.criterio_servicios = criterio;

            // Guardamos los datos en la BD
            await this.cumplimientoServiciosRepository.save(cumplimiento);

            // ASIGNAR LA AUDITORIA DE LA CALIFICACION ASIGNADO AL CRITERIO
            // await this.auditoria_registro_services.logCreateCumplimientoTodosServicios(
            //     payloadInterface.usu_nombre,
            //     payloadInterface.usu_apellido,
            //     'ip',
            //     dto.cumps_cumple,
            //     nombre_criterio,
            //     nombre_estandar,
            //     acta_idInd,
            //     year,
            // );

            return new MessageDto('El cumplimiento ha sido Creado Correctamente');
        } catch (error) {
            throw error;
        }
    }


    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoServiciosRepository.delete(cumplimiento.cumps_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCumplimiento(id: number, dto: CumplimientoServiciosDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cumps_cumple ? cumplimiento.cumps_cumple = dto.cumps_cumple : cumplimiento.cumps_cumple = cumplimiento.cumps_cumple;
        dto.cumps_hallazgo ? cumplimiento.cumps_hallazgo = dto.cumps_hallazgo : cumplimiento.cumps_hallazgo = cumplimiento.cumps_hallazgo;

        await this.cumplimientoServiciosRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    }

}
