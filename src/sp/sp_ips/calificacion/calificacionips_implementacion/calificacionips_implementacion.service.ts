import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioImplementacionEntity } from '../../criterioimplementacion.entity';
import { CriterioImplemRepository } from '../../criterioimplement.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CalificacionImplementacionIpsEntity } from '../../calificacionips_implementacion.entity';
import { MessageDto } from 'src/common/message.dto';
import { CalificacionImpleDto } from 'src/usuario/dto/SpIps/calificaciones/calificacionimplementacion.dto';
import { CalificacionIpsImplementacionRepository } from '../../calificacionips_implementacion.repository';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { EvaluacionipsEntity } from '../../evaluacionips.entity';
import { EvaluacionIpsRepository } from '../../evaluacionips.repository';

@Injectable()
export class CalificacionipsImplementacionService {

    constructor(
        @InjectRepository(CriterioImplementacionEntity)
        private readonly criterioImplemRepository: CriterioImplemRepository,
        @InjectRepository(CalificacionImplementacionIpsEntity)
        private readonly calificacionIpsImplementacionRepository: CalificacionIpsImplementacionRepository,
        @InjectRepository(EvaluacionipsEntity)
        private readonly evaluacionIpsRepository: EvaluacionIpsRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
    ) { }

    //buscar calificacion por id
    async findByCal(cal_id: number): Promise<CalificacionImplementacionIpsEntity> {
        const calificacion = await this.calificacionIpsImplementacionRepository.findOne({ where: { cal_id } })
        if (!calificacion) {
            throw new NotFoundException(new MessageDto('La calificacion No Existe'));
        }
        return calificacion
    }

    //LISTAR CALIFICACION POR ID_CRITERIO - ID_EVALUACIÓN - ID ACTA
    async getCriterioByIdEva(cri_id: number, eva_id: number, id_acta: number): Promise<CalificacionImplementacionIpsEntity> {
        const calificacion = await this.calificacionIpsImplementacionRepository.createQueryBuilder('calificacion')
            .select(['calificacion.cal_id', 'calificacion.cal_nota', 'calificacion.cal_observaciones',
                'calificacion.eva_ips_id', 'calificacionipsImpl.cri_imp_nombre'])
            .innerJoin('calificacion.calificacionipsImpl', 'calificacionipsImpl')
            .where('calificacionipsImpl.cri_imp_id = :cri', { cri: cri_id })
            .andWhere('calificacion.eva_ips_id = :id_evaluacion', { id_evaluacion: eva_id })
            .andWhere('calificacion.acta_ips = :id_acta', { id_acta: id_acta })
            .getOne()
        return calificacion
    }


    //LISTAR TODAS LAS CALIFICACIONES QUE PERTENECEN AL ID_ACTA Y EVALUACION
    async listarTodasLasCalificacionesPorIdActa(id_eva_ips: number, id_acta: number): Promise<CalificacionImplementacionIpsEntity[]> {
        const calificaciones = await this.calificacionIpsImplementacionRepository.createQueryBuilder('calificaciones')
            .select(['calificaciones.cal_id', 'calificaciones.cal_nota',
                'calificaciones.cal_observaciones', 'calificaciones.acta_ips'])
            .innerJoinAndSelect('calificaciones.calificacionipsImpl', 'calificacionipsImpl')
            .where('calificaciones.eva_ips_id = :id_evaluacion', { id_evaluacion: id_eva_ips })
            .andWhere('calificaciones.acta_ips = :id_acta', { id_acta: id_acta })
            .getMany()
        return calificaciones
    }

    // creacion de calificacion
    async create(payloads: { dto_calificacion: CalificacionImpleDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto_calificacion, tokenDto } = payloads;
            const criterio_implementacion = await this.criterioImplemRepository.findOne({ where: { cri_imp_id: dto_calificacion.cri_ips_id } });
            if (!criterio_implementacion) {
                throw new NotFoundException(new MessageDto('El criterio no ha sido creado'))
            }
            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const calificacion = this.calificacionIpsImplementacionRepository.create(dto_calificacion)
            //asigna la evaluacion al criterio
            calificacion.calificacionipsImpl = criterio_implementacion

            const nombre_criterio = criterio_implementacion.cri_imp_nombre;

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


            //CONSULTA LA EVALUACION A LA CUAL SE LE CREA LA CALIFICACION PARA ENVIAR AL LOG
            const evaluacion = await this.evaluacionIpsRepository.createQueryBuilder('evaluacion_nombre')
                .select(['evaluacion_nombre.evips_nombre'])
                .where('evaluacion_nombre.evips_id = :id_evaluacion', { id_evaluacion: dto_calificacion.eva_ips_id })
                .getOne()

            //ASIGNAMOS EL NOMBRE DE LA EVALUACIÓN
            const nombre_evaluacion = evaluacion.evips_nombre


            const acta_idIps = dto_calificacion.acta_ips

            await this.calificacionIpsImplementacionRepository.save(calificacion)
            await this.auditoria_registro_services.logCreateCalificacionSpIps(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                '',
                dto_calificacion.cal_nota,
                nombre_criterio,
                nombre_evaluacion,
                acta_idIps,
                year,
            );

            return new MessageDto('La calificacion ha sido Creada');
        } catch (error) {
            throw new InternalServerErrorException(new MessageDto(error.message));
        }
    }


    // actualizacion de calificacion 
    async update(id: number, payloads: { dto_calificacion: CalificacionImpleDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto_calificacion, tokenDto } = payloads;

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

            const calificacion = await this.findByCal(id);
            if (!calificacion)
                throw new NotFoundException(new MessageDto('La calificacion No Existe'));

            dto_calificacion.cal_nota ? calificacion.cal_nota = dto_calificacion.cal_nota : calificacion.cal_nota = calificacion.cal_nota;
            dto_calificacion.cal_observaciones ? calificacion.cal_observaciones = dto_calificacion.cal_observaciones : calificacion.cal_observaciones = calificacion.cal_observaciones;

            const criterio_implementacion = await this.criterioImplemRepository.findOne({ where: { cri_imp_id: dto_calificacion.cri_ips_id } });
            if (!criterio_implementacion) {
                throw new NotFoundException(new MessageDto('El criterio no ha sido creado'))
            }

            const nombre_criterio = criterio_implementacion.cri_imp_nombre;

            //CONSULTA LA EVALUACION A LA CUAL SE LE ACTUALIZA LA CALIFICACION PARA ENVIAR AL LOG
            const evaluacion = await this.evaluacionIpsRepository.createQueryBuilder('evaluacion_nombre')
                .select(['evaluacion_nombre.evips_nombre'])
                .where('evaluacion_nombre.evips_id = :id_evaluacion', { id_evaluacion: dto_calificacion.eva_ips_id })
                .getOne()

            //ASIGNAMOS EL NOMBRE DE LA EVALUACIÓN
            const nombre_evaluacion = evaluacion.evips_nombre

            const acta_idIps = dto_calificacion.acta_ips

            await this.calificacionIpsImplementacionRepository.save(calificacion);
            await this.auditoria_actualizacion_services.logUpdateCalificacionSpIps(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                '',
                dto_calificacion.cal_nota,
                nombre_criterio,
                nombre_evaluacion,
                acta_idIps,
                year,
            );
            return new MessageDto(`La calificación  ha sido Actualizada`);
        } catch (error) {
            throw new InternalServerErrorException(new MessageDto(error.message));
        }
    }

    //ELIMINAR CALIFICACIÓN
    async delete(id: number): Promise<any> {
        const calificacion = await this.findByCal(id);
        await this.calificacionIpsImplementacionRepository.delete(calificacion.cal_id)
        return new MessageDto(`calificacion Eliminada`);
    }

    //lista las calificaciones con sus criterios
    async getallCalCrixEva(evips_id: number, act_id: number): Promise<CalificacionImplementacionIpsEntity[]> {

        const criterio = await this.calificacionIpsImplementacionRepository.createQueryBuilder('calificacion')
            .select(['calificacion'])
            .innerJoinAndSelect('calificacion.calificacionipsImpl', 'calificacionipsImpl')
            .innerJoinAndSelect('calificacionipsImpl.cri_imp_eva', 'cri_imp_eva')
            .innerJoinAndSelect('cri_imp_eva.actas_ips', 'actas_ips')
            .where('calificacion.acta_ips = :id_acta', { id_acta: act_id })
            .andWhere('calificacion.eva_ips_id = :id_eva', { id_eva: evips_id })
            .getMany()

        return criterio
    }


}
