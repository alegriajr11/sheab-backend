import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioIndEntity } from '../criterioind.entity';
import { CriterioIndRepository } from '../criterioind.repository';
import { CalificacionIndEntity } from '../calificacionind.entity';
import { CalificacionIndRepository } from '../calificacionind.repository';
import { EvaluacionIndependientesEntity } from '../evaluacion-independientes.entity';
import { EvaluacionIndependientesRepository } from '../evaluacion-independientes.repository';
import { CalificacionindDto } from '../dto/calificacionind.dto';
import { MessageDto } from 'src/common/message.dto';
import { EtapaInd } from '../etapaind.entity';
import { EtapaIndRepository } from '../etapaind.repository';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';

@Injectable()
export class CalificacionindService {

    constructor(
        @InjectRepository(CriterioIndEntity)
        private criterioIndRepository: CriterioIndRepository,
        @InjectRepository(EvaluacionIndependientesEntity)
        private evaluacionIndependientesRepository: EvaluacionIndependientesRepository,
        @InjectRepository(CalificacionIndEntity)
        private calificacionIndRepository: CalificacionIndRepository,
        @InjectRepository(EtapaInd)
        private etapaindRepository: EtapaIndRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,

    ) { }

    //ENCONTRAR POR ID - CALIFICACION IND
    async findById(cal_id: number): Promise<CalificacionIndEntity> {
        const calificacion = await this.calificacionIndRepository.findOne({ where: { cal_id } });
        if (!calificacion) {
            throw new NotFoundException(new MessageDto('La calificacion No Existe'));
        }
        return calificacion;
    }

    //LISTAR CALIFICACION POR ID_CRITERIO Y ID_EVALUACIÓN
    async getCriterioByIdEva(cri_id: number, eva_id: number): Promise<CalificacionIndEntity> {

        const calificacion = await this.calificacionIndRepository.createQueryBuilder('calificacion')
            .select(['calificacion'])
            .innerJoinAndSelect('calificacion.criterio_cal', 'criterio_cal')
            .innerJoinAndSelect('calificacion.cal_evaluacion_independientes', 'cal_evaluacion_independientes')
            .where('criterio_cal.cri_id = :id_cri', { id_cri: cri_id })
            .andWhere('cal_evaluacion_independientes.eva_id = :id_eva', { id_eva: eva_id })
            .getOne()
        return calificacion
    }

    //LISTAR TODAS LAS CALIFICACIONES POR ID_EVALUACION
    async getCalificacionByEva(eva_id: number): Promise<CalificacionIndEntity[]> {
        const calificaciones = await this.calificacionIndRepository.createQueryBuilder('calificaciones')
            .select(['calificaciones'])
            .innerJoinAndSelect('calificaciones.cal_evaluacion_independientes', 'cal_evaluacion_independientes')
            .innerJoinAndSelect('calificaciones.criterio_cal', 'criterio_cal')
            .innerJoinAndSelect('cal_evaluacion_independientes.eval_acta_ind', 'eval_acta_ind')
            .where('cal_evaluacion_independientes.eva_id = :id_eva', { id_eva: eva_id })
            .getMany()

        if (calificaciones.length === 0) {
            throw new NotFoundException(new MessageDto('No hay calificaciones en esa evaluación'));
        }

        return calificaciones
    }

    //CREAR CALIFICACION
    async createCalificacion(payloads: { dto: CalificacionindDto, tokenDto: TokenDto }): Promise<any> {
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

            // SE BUSCA EL CRITERIO QUE SE ASIGNA A LA CALIFICACION
            const criterio_ind = await this.criterioIndRepository.findOne({ where: { cri_id: dto.cri_ind_id } });
            if (!criterio_ind) {
                throw new Error('El criterio no ha sido creado');
            }

            const nombre_criterio = criterio_ind.cri_nombre;

            // SE BUSCA LA EVALUACION QUE SE ASIGNA AL CUMPLIMIENTO
            const evaluacion_ind = await this.evaluacionIndependientesRepository.findOne({ where: { eva_id: dto.eva_ind_id }, relations: ['eval_acta_ind'] });
            if (!evaluacion_ind) {
                throw new Error('La evaluación no ha sido creada');
            }

            //ASIGNO EL ACTA ID
            const acta_idInd = evaluacion_ind.eval_acta_ind.act_id;
            // ASIGNO EL CUMPLIMIENTO EN ASIGNADO
            dto.cal_asignado = 'asignado';

            // CREAMOS EL DTO DE LA CALIFICACIÓN
            const calificacion = await this.calificacionIndRepository.create(dto);

            // ASIGNAMOS LA FORANEA DE CALIFICACION CON CRITERIO_IND
            calificacion.criterio_cal = criterio_ind;
            // ASIGNAMOS LA FORANEA DE CUMPLIMIENTO CON EVALUACIÓN_SIC CREADA
            calificacion.cal_evaluacion_independientes = evaluacion_ind;

            // GUARDAMOS EL CUMPLIMIENTO A LA BASE DE DATOS
            await this.calificacionIndRepository.save(calificacion);

            // ASIGNAR LA AUDITORIA DE LA CALIFICACION ASIGNADO AL CRITERIO
            await this.auditoria_registro_services.logCreateCalificacionSpInd(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                dto.cal_nota,
                nombre_criterio,
                acta_idInd,
                year,
            );

            return new MessageDto('Calificación Asignada');
        } catch (error) {
            // Manejo de un error
            throw new InternalServerErrorException(new MessageDto(error.message));

        }
    }


    //criterio por titulo
    async getallcriterioetapa(eva_id: number): Promise<CalificacionIndEntity[]> {

        let titulo_uno
        titulo_uno = "COMPROMISO DEL PROFESIONAL INDEPENDIENTE CON LA ATENCION  SEGURA DEL PACIENTE"

        const criterio = await this.calificacionIndRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criterio_cal.cri_id', 'criterio_cal.cri_nombre', 'criterio_cal.cri_verificacion', 'eta_item.eta_nombre'])
            .innerJoin('calificacion.criterio_cal', 'criterio_cal')
            .innerJoinAndSelect('criterio_cal.eta_item', 'eta_item')
            .innerJoinAndSelect('calificacion.cal_evaluacion_independientes', 'cal_evaluacion_independientes')
            .where('eta_item.eta_nombre LIKE :titulo', { titulo: titulo_uno })
            .andWhere('cal_evaluacion_independientes.eva_id = :id_eva', { id_eva: eva_id })
            .getMany()

        return criterio
    }

    async getallcriterioxtitulodos(eva_id: number): Promise<CalificacionIndEntity[]> {

        let titulo_dos
        titulo_dos = "CONOCIMIENTOS BÁSICOS DE LA SEGURIDAD DEL PACIENTE"

        const criterio = await this.calificacionIndRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criterio_cal.cri_id', 'criterio_cal.cri_nombre', 'criterio_cal.cri_verificacion', 'eta_item.eta_nombre'])
            .innerJoin('calificacion.criterio_cal', 'criterio_cal')
            .innerJoinAndSelect('criterio_cal.eta_item', 'eta_item')
            .innerJoinAndSelect('calificacion.cal_evaluacion_independientes', 'cal_evaluacion_independientes')
            .where('eta_item.eta_nombre LIKE :titulo', { titulo: titulo_dos })
            .andWhere('cal_evaluacion_independientes.eva_id = :id_eva', { id_eva: eva_id })
            .getMany()

        return criterio
    }

    async getallcriterioxtitulotres(eva_id: number): Promise<CalificacionIndEntity[]> {

        let titulo_tres
        titulo_tres = "REGISTRO DE FALLAS EN LA ATENCIÓN EN SALUD y PLAN DE MEJORAMIENTO"

        const criterio = await this.calificacionIndRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criterio_cal.cri_id', 'criterio_cal.cri_nombre', 'criterio_cal.cri_verificacion', 'eta_item.eta_nombre'])
            .innerJoin('calificacion.criterio_cal', 'criterio_cal')
            .innerJoinAndSelect('criterio_cal.eta_item', 'eta_item')
            .innerJoinAndSelect('calificacion.cal_evaluacion_independientes', 'cal_evaluacion_independientes')
            .where('eta_item.eta_nombre LIKE :titulo', { titulo: titulo_tres })
            .andWhere('cal_evaluacion_independientes.eva_id = :id_eva', { id_eva: eva_id })
            .getMany()

        return criterio
    }

    async getallcriterioxtitulocuatro(eva_id: number): Promise<CalificacionIndEntity[]> {

        let titulo_cuatro
        titulo_cuatro = "DETECCIÓN, PREVENCIÓN Y CONTROL DE INFECCIONES ASOCIADAS AL CUIDADO"

        const criterio = await this.calificacionIndRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criterio_cal.cri_id', 'criterio_cal.cri_nombre', 'criterio_cal.cri_verificacion', 'eta_item.eta_nombre'])
            .innerJoin('calificacion.criterio_cal', 'criterio_cal')
            .innerJoinAndSelect('criterio_cal.eta_item', 'eta_item')
            .innerJoinAndSelect('calificacion.cal_evaluacion_independientes', 'cal_evaluacion_independientes')
            .where('eta_item.eta_nombre LIKE :titulo', { titulo: titulo_cuatro })
            .andWhere('cal_evaluacion_independientes.eva_id = :id_eva', { id_eva: eva_id })
            .getMany()

        return criterio
    }

    //EDITAR CALIFICACION
    async update(id: number, payloads: { dto: CalificacionindDto, tokenDto: TokenDto }): Promise<any> {
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

            const calificacion = await this.findById(id);
            if (!calificacion) {
                throw new NotFoundException(new MessageDto('La Calificacion No existe'));
            }

            dto.cal_nota ? calificacion.cal_nota = dto.cal_nota : calificacion.cal_nota = calificacion.cal_nota;
            dto.cal_observaciones ? calificacion.cal_observaciones = dto.cal_observaciones : calificacion.cal_observaciones = calificacion.cal_observaciones;

            // SE BUSCA EL CRITERIO QUE SE ASIGNA A LA CALIFICACION
            const criterio_ind = await this.criterioIndRepository.findOne({ where: { cri_id: dto.cri_ind_id } });
            if (!criterio_ind) {
                throw new Error('El criterio no ha sido creado');
            }

            const nombre_criterio = criterio_ind.cri_nombre;

            // SE BUSCA LA EVALUACION QUE SE ASIGNA AL CUMPLIMIENTO
            const evaluacion_ind = await this.evaluacionIndependientesRepository.findOne({ where: { eva_id: dto.eva_ind_id }, relations: ['eval_acta_ind'] });
            if (!evaluacion_ind) {
                throw new Error('La evaluación no ha sido creada');
            }

            //ASIGNO EL ACTA ID
            const acta_idInd = evaluacion_ind.eval_acta_ind.act_id;

            await this.calificacionIndRepository.save(calificacion);
            
            // ASIGNAR LA AUDITORIA DE LA CALIFICACION ASIGNADO AL CRITERIO
            await this.auditoria_actualizacion_services.logUpdateCalificacionSpInd(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                dto.cal_nota,
                nombre_criterio,
                acta_idInd,
                year,
            );

            return new MessageDto(`La calificacion ha sido Actualizada`);
        } catch (error) {
            // Aquí puedes manejar el error como desees, por ejemplo, registrarlo o lanzar una excepción personalizada.
            throw error;
        }
    }
}
