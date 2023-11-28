import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioAjusteEntity } from '../../criterioajuste.entity';
import { CriterioAjusteRepository } from '../../criterioajuste.repository';
import { CalificacionAjusteIpsEntity } from '../../calificacionips_ajuste.entity';
import { CalificacionIpsAjusteRepository } from '../../calificacionips_ajuste.repository';
import { MessageDto } from 'src/common/message.dto';
import { CalificacionAjusteDto } from 'src/usuario/dto/SpIps/calificaciones/calificacionajuste.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';
import { EvaluacionipsEntity } from '../../evaluacionips.entity';
import { EvaluacionIpsRepository } from '../../evaluacionips.repository';

@Injectable()
export class CalificacionipsAjusteService {

    constructor(
        @InjectRepository(CriterioAjusteEntity)
        private readonly criterioAjusteRepository: CriterioAjusteRepository,
        @InjectRepository(CalificacionAjusteIpsEntity)
        private readonly calificacionIpsAjusteRepository: CalificacionIpsAjusteRepository,
        @InjectRepository(EvaluacionipsEntity)
        private readonly evaluacionIpsRepository: EvaluacionIpsRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        // private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }

    //buscar calificacion por id
    async findByCal(cal_id: number): Promise<CalificacionAjusteIpsEntity> {
        const criterio = await this.calificacionIpsAjusteRepository.findOne({ where: { cal_id } })
        if (!criterio) {
            throw new NotFoundException(new MessageDto('La calificacion No Existe'));
        }
        return criterio
    }



    //LISTAR CALIFICACION POR ID_CRITERIO - ID_EVALUACIÓN - ID ACTA
    async getCriterioByIdEva(cri_id: number, eva_id: number, id_acta: number): Promise<CalificacionAjusteIpsEntity> {
        const calificacion = await this.calificacionIpsAjusteRepository.createQueryBuilder('calificacion')
            .select(['calificacion.cal_id', 'calificacion.cal_nota', 'calificacion.cal_observaciones',
                'calificacion.eva_ips_id', 'calificacionipsAjuste.cri_aju_nombre'])
            .innerJoin('calificacion.calificacionipsAjuste', 'calificacionipsAjuste')
            .where('calificacionipsAjuste.cri_aju_id = :cri', { cri: cri_id })
            .andWhere('calificacion.eva_ips_id = :id_evaluacion', { id_evaluacion: eva_id })
            .andWhere('calificacion.acta_ips = :id_acta', { id_acta: id_acta })
            .getOne()
        return calificacion
    }


    //LISTAR TODAS LAS CALIFICACIONES QUE PERTENECEN AL ID_ACTA Y EVALUACION
    async listarTodasLasCalificacionesPorIdActa(id_eva_ips: number, id_acta: number): Promise<CalificacionAjusteIpsEntity[]> {
        const calificaciones = await this.calificacionIpsAjusteRepository.createQueryBuilder('calificaciones')
            .select(['calificaciones.cal_id', 'calificaciones.cal_nota',
                'calificaciones.cal_observaciones', 'calificaciones.acta_ips'])
            .innerJoinAndSelect('calificaciones.calificacionipsAjuste', 'calificacionipsAjuste')
            .where('calificaciones.eva_ips_id = :id_evaluacion', { id_evaluacion: id_eva_ips })
            .andWhere('calificaciones.acta_ips = :id_acta', { id_acta: id_acta })
            .getMany()
        return calificaciones
    }

    // creacion de calificacion con su respectivo criterio
    async create(payloads: { dto_calificacion: CalificacionAjusteDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto_calificacion, tokenDto } = payloads;
            const criterio_ajuste = await this.criterioAjusteRepository.findOne({ where: { cri_aju_id: dto_calificacion.cri_ips_id } });
            if (!criterio_ajuste) {
                throw new NotFoundException(new MessageDto('El criterio no ha sido creado'))
            }


            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const calificacion = this.calificacionIpsAjusteRepository.create(dto_calificacion)
            //asigna la calificacion al criterio
            calificacion.calificacionipsAjuste = criterio_ajuste

            const nombre_criterio = criterio_ajuste.cri_aju_nombre;

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

            await this.calificacionIpsAjusteRepository.save(calificacion)
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
    async update(id: number, payloads: { dto_calificacion: CalificacionAjusteDto, tokenDto: TokenDto }): Promise<any> {

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

            const criterio_ajuste = await this.criterioAjusteRepository.findOne({ where: { cri_aju_id: dto_calificacion.cri_ips_id } });
            if (!criterio_ajuste) {
                throw new NotFoundException(new MessageDto('El criterio no ha sido creado'))
            }

            const nombre_criterio = criterio_ajuste.cri_aju_nombre;

            //CONSULTA LA EVALUACION A LA CUAL SE LE ACTUALIZA LA CALIFICACION PARA ENVIAR AL LOG
            const evaluacion = await this.evaluacionIpsRepository.createQueryBuilder('evaluacion_nombre')
                .select(['evaluacion_nombre.evips_nombre'])
                .where('evaluacion_nombre.evips_id = :id_evaluacion', { id_evaluacion: dto_calificacion.eva_ips_id })
                .getOne()

            //ASIGNAMOS EL NOMBRE DE LA EVALUACIÓN PARA ENVIAR AL LOG
            const nombre_evaluacion = evaluacion.evips_nombre

            const acta_idIps = dto_calificacion.acta_ips

            await this.calificacionIpsAjusteRepository.save(calificacion);
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
            return new MessageDto(`La calificacion  ha sido Actualizada`);
        } catch (error) {
            throw new InternalServerErrorException(new MessageDto(error.message));
        }
    }


    //Eliminación Calificacion
    async delete(id: number): Promise<any> {
        const calificacion = await this.findByCal(id);
        await this.calificacionIpsAjusteRepository.delete(calificacion.cal_id)
        return new MessageDto(`calificacion Eliminada`);
    }


    //lista las calificaciones con sus criterios
    async getallCalCrixEva(evips_id: number, act_id: number): Promise<CalificacionAjusteIpsEntity[]> {
        const criterio = await this.calificacionIpsAjusteRepository.createQueryBuilder('calificacion')
            .select(['calificacion'])
            .innerJoinAndSelect('calificacion.calificacionipsAjuste', 'calificacionipsAjuste')
            .innerJoinAndSelect('calificacionipsAjuste.cri_aju_eva', 'cri_aju_eva')
            .innerJoinAndSelect('cri_aju_eva.actas_ips', 'actas_ips')
            .where('calificacion.acta_ips = :id_acta', { id_acta: act_id })
            .andWhere('calificacion.eva_ips_id = :id_eva', { id_eva: evips_id })
            .getMany()
        return criterio
    }

}
