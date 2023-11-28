import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalificacionpamEntity } from '../calificacionpam.entity';
import { CalificacionPamRepository } from '../calificacionpam.repository';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { PrestadorRepository } from 'src/prestador/prestador.repository';
import { ActividadEntity } from '../actividad.entity';
import { ActividadRepository } from '../actividad.repository';
import { CriteriopamEntity } from '../criteriopam.entity';
import { CriterioPamRepository } from '../criteriopam.repository';
import { MessageDto } from 'src/common/message.dto';
import { CalificacionPamDto } from 'src/usuario/dto/Pamec/calificacionpam.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/auth/payload.interface';
import { EvaluacionPamecEntity } from '../evaluacion-pamec.entity';
import { EvaluacionPamecRepository } from '../evaluacion-pamec.repository';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';

@Injectable()
export class CalificacionpamecService {

    constructor(
        @InjectRepository(ActividadEntity)
        private readonly actividadRepository: ActividadRepository,
        @InjectRepository(CalificacionpamEntity)
        private readonly calificacionPamRepository: CalificacionPamRepository,
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
        private readonly jwtService: JwtService,
        @InjectRepository(CriteriopamEntity)
        private readonly criterioPamRepository: CriterioPamRepository,
        @InjectRepository(EvaluacionPamecEntity)
        private readonly evaluacionPamecRepository: EvaluacionPamecRepository,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,

    ) { }

    //ENCONTRAR CRITERIO POR ID
    async findByIdCriterioPamec(crip_id: number): Promise<CriteriopamEntity> {
        const criterioPamec = await this.criterioPamRepository.findOne({ where: { crip_id } });
        if (!criterioPamec) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterioPamec;
    }
    //ENCONTRAR  POR ID
    async findByIdCalificacionPamec(cal_id: number): Promise<CalificacionpamEntity> {
        const calificacionPamec = await this.calificacionPamRepository.findOne({ where: { cal_id } });
        if (!calificacionPamec) {
            throw new NotFoundException(new MessageDto('La Calificacion No Existe'));
        }
        return calificacionPamec;
    }



    // listar todas las calificaciones
    async getall(): Promise<CalificacionpamEntity[]> {
        const cumplimiento_estandar = await this.calificacionPamRepository.createQueryBuilder('calificaciones')
            .select(['calificaciones', 'criteriopam.crip_desarrollo_etapas', 'criteriopam.crip_nombre', 'crip_actividad.act_nombre'])
            .innerJoin('calificaciones.criteriopam', 'criteriopam')
            .innerJoinAndSelect('criteriopam.crip_actividad', 'crip_actividad')
            .getMany()
        if (!cumplimiento_estandar.length) throw new NotFoundException(new MessageDto('No hay Usuarios en la lista'))
        return cumplimiento_estandar
    }


    //CREAR CALIFICACION PAMEC
    async create(payloads: { dto: CalificacionPamDto, tokenDto: TokenDto }): Promise<any> {
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

        const evaluacion = await this.evaluacionPamecRepository.findOne({ where: { eva_id: dto.eva_pam_id }, relations: ['eval_acta_pamec'] });
        if (!evaluacion) throw new NotFoundException(new MessageDto('La evaluacion no ha sido creada'))

        const criterio = await this.criterioPamRepository.findOne({ where: { crip_id: dto.cri_pam_id } });
        if (!criterio) throw new NotFoundException(new MessageDto('El criterio no ha sido creada'))

        const calificacion = this.calificacionPamRepository.create(dto)
        //asigna la evaluacion a la calificacion
        calificacion.cal_evaluacion_pam = evaluacion
        //asigna eñ criterio a la evaluacion
        calificacion.criteriopam_calificacion = criterio

        const nombre_criterio = calificacion.criteriopam_calificacion.crip_nombre;

        //ASIGNO EL ACTA ID
        const acta_idInd = evaluacion.eval_acta_pamec.act_id;

        await this.calificacionPamRepository.save(calificacion)

        // ASIGNAR LA AUDITORIA DE LA CALIFICACION ASIGNADO AL CRITERIO
        await this.auditoria_registro_services.logCreateCalificacionPamec(
            payloadInterface.usu_nombre,
            payloadInterface.usu_apellido,
            'ip',
            dto.cal_nota,
            nombre_criterio,
            acta_idInd,
            year,
        );
        return new MessageDto('La calificacionha sido Creada');
    }

    //ACTUALIZACION CALIFICACION PAMEC
    async update(cal_id: number, payloads: { dto: CalificacionPamDto, tokenDto: TokenDto }): Promise<any> {
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


            const calificacion = await this.findByIdCalificacionPamec(cal_id);
            if (!calificacion)
                throw new NotFoundException(new MessageDto('La Calificacion No Existe'));

            dto.cal_nota ? calificacion.cal_nota = dto.cal_nota : calificacion.cal_nota = calificacion.cal_nota;
            dto.cal_aplica ? calificacion.cal_aplica = dto.cal_aplica : calificacion.cal_aplica = calificacion.cal_aplica;
            dto.cal_observaciones ? calificacion.cal_observaciones = dto.cal_observaciones : calificacion.cal_observaciones = calificacion.cal_observaciones;

            const evaluacion = await this.evaluacionPamecRepository.findOne({ where: { eva_id: dto.eva_pam_id } });
            if (!evaluacion) throw new NotFoundException(new MessageDto('La evaluacion no ha sido creada'))

            const criterio = await this.criterioPamRepository.findOne({ where: { crip_id: dto.cri_pam_id } });
            if (!criterio) throw new NotFoundException(new MessageDto('El criterio no ha sido creada'))

            const nombre_criterio = calificacion.criteriopam_calificacion.crip_nombre;

            const acta_idInd = evaluacion.eval_acta_pamec.act_id;

            await this.calificacionPamRepository.save(calificacion);
            // ASIGNAR LA AUDITORIA DE LA CALIFICACION ASIGNADO AL CRITERIO
            await this.auditoria_actualizacion_services.logUpdateCalificacionPamec(
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
            throw new InternalServerErrorException(new MessageDto(error.message));
        }
    }

    //LISTANDO CRITERIOS Y CALIFICACION POR EVALUACION
    async getCriCalIdeva(id: number): Promise<CalificacionpamEntity[]> {
        const calificacion = await this.calificacionPamRepository.createQueryBuilder('listado')
            .select(['listado', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas'])
            .innerJoin('listado.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoin('listado.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: id })
            .getMany()
        if (!calificacion) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return calificacion
    }

    //actividad
    async getallcriterioxtitulouno(eva_id: number): Promise<CalificacionpamEntity[]> {

        let titulo_uno
        titulo_uno = "ACTIVIDADES PREVIAS"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas', 'crip_actividad.act_nombre'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_uno })
            .andWhere('cal_evaluacion_pam.eva_id = :id_eva', { id_eva: eva_id })
            .getMany()

        return criterio
    }

    //actividad
    async getallcriterioxtitulodos(eva_id: number): Promise<CalificacionpamEntity[]> {

        let titulo_dos
        titulo_dos = "AUTOEVALUACIÓN"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas', 'crip_actividad.act_nombre'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_dos })
            .andWhere('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: eva_id })
            .getMany()

        return criterio
    }

    //actividad
    async getallcriterioxtitulotres(eva_id: number): Promise<CalificacionpamEntity[]> {

        let titulo_tres
        titulo_tres = "SELECCIÓN DE LOS PROCESOS A MEJORAR"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_tres })
            .andWhere('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: eva_id })
            .getMany()

        return criterio
    }

    //actividad
    async getallcriterioxtitulocuatro(eva_id: number): Promise<CalificacionpamEntity[]> {

        let titulo_cuatro
        titulo_cuatro = "PRIORIZACION"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_cuatro })
            .andWhere('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: eva_id })
            .getMany()

        return criterio
    }

    //actividad
    async getallcriterioxtitulocinco(eva_id): Promise<CalificacionpamEntity[]> {

        let titulo_cinco
        titulo_cinco = "DEFINICIÓN DE LA CALIDAD ESPERADA"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_cinco })
            .andWhere('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: eva_id })
            .getMany()

        return criterio
    }

    //actividad
    async getallcriterioxtituloseis(eva_id: number): Promise<CalificacionpamEntity[]> {

        let titulo_seis
        titulo_seis = "DEFINICIÓN DE LA CALIDAD OBSERVADA"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_seis })
            .andWhere('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: eva_id })
            .getMany()

        return criterio
    }

    //actividad
    async getallcriterioxtitulosiete(eva_id: number): Promise<CalificacionpamEntity[]> {

        let titulo_siete
        titulo_siete = "PLAN DE MEJORAMIENTO PARA EL CIERRE DE BRECHAS"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_siete })
            .andWhere('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: eva_id })
            .getMany()

        return criterio
    }

    //actividad
    async getallcriterioxtituloocho(eva_id): Promise<CalificacionpamEntity[]> {

        let titulo_ocho
        titulo_ocho = "EJECUCION Y SEGUIMIENTO AL PLAN DE MEJORAMIENTO"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_ocho })
            .andWhere('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: eva_id })
            .getMany()

        return criterio
    }


    //actividad
    async getallcriterioxtitulonueve(eva_id: number): Promise<CalificacionpamEntity[]> {

        let titulo_nueve
        titulo_nueve = "EVALUACION PLAN DE MEJORAMIENTO"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_nueve })
            .andWhere('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: eva_id })
            .getMany()

        return criterio
    }

    //actividad
    async getallcriterioxtitulodiez(eva_id: number): Promise<CalificacionpamEntity[]> {

        let titulo_diez
        titulo_diez = "APRENDIZAJE ORGANIZACIONAL"

        const criterio = await this.calificacionPamRepository.createQueryBuilder('calificacion')
            .select(['calificacion', 'criteriopam_calificacion.crip_nombre', 'criteriopam_calificacion.crip_desarrollo_etapas'])
            .innerJoin('calificacion.criteriopam_calificacion', 'criteriopam_calificacion')
            .innerJoinAndSelect('criteriopam_calificacion.crip_actividad', 'crip_actividad')
            .innerJoinAndSelect('calificacion.cal_evaluacion_pam', 'cal_evaluacion_pam')
            .where('crip_actividad.act_nombre LIKE :titulo', { titulo: titulo_diez })
            .andWhere('cal_evaluacion_pam.eva_id = :eva_id', { eva_id: eva_id })
            .getMany()

        return criterio
    }



}
