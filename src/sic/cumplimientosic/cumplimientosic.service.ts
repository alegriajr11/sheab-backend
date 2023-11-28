import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriteriosicEntity } from '../criteriosic.entity';
import { CriterioSicRepository } from '../criteriosic.repository';
import { EvaluacionSicEntity } from '../evaluacionsic.entity';
import { EvaluacionsicRepository } from '../evaluacionsic.repository';
import { CumplimientoSicEntity } from '../cumplimientosic.entity';
import { CumplimientoSicRepository } from '../cumplimientosic.repository';
import { CumplimientoSicDto } from 'src/usuario/dto/Sic/cumplimientosic.dto';
import { MessageDto } from 'src/common/message.dto';
import { IndicadorEntity } from '../indicador.entity';
import { IndicadorRepository } from '../indicador.repository';
import { CumplimientoEstandarSicEntity } from '../cumplimientoestandar.entity';
import { CumplimientoEstandarSicRepository } from '../cumplimientoEstandar.repository';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CumplimientosicService {

    constructor(
        @InjectRepository(CriteriosicEntity)
        private criterioSicRepository: CriterioSicRepository,
        @InjectRepository(EvaluacionSicEntity)
        private evaluacionsicRepository: EvaluacionsicRepository,
        @InjectRepository(CumplimientoSicEntity)
        private cumplimientoSicRepository: CumplimientoSicRepository,
        @InjectRepository(CumplimientoEstandarSicEntity)
        private cumplimientoEstandarSicRepository: CumplimientoEstandarSicRepository,
        @InjectRepository(IndicadorEntity)
        private indicadorRepository: IndicadorRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO SIC 
    async findById(cumpl_id: number): Promise<CumplimientoSicEntity> {
        const cumplimiento = await this.cumplimientoSicRepository.findOne({ where: { cumpl_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El Cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //CREAR CUMPLIMIENTO
    async create( payloads: { dto: CumplimientoSicDto, tokenDto: TokenDto}): Promise<any> {
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

            //busca si la evaluacion existe
            const evaluacion_ind = await this.evaluacionsicRepository.findOne({ where: { eva_id: dto.eva_sic_id }, relations: ['eval_acta_sic'] });
            if (!evaluacion_ind) throw new NotFoundException(new MessageDto('La evaluacion no ha sido creada'))

            //ASIGNO EL ACTA ID
            const acta_idInd = evaluacion_ind.eval_acta_sic.act_id;

            //busca si el criterio existe
            const criterio_ind = await this.criterioSicRepository.findOne({ where: { cri_id: dto.cri_sic_id } });
            if (!criterio_ind) throw new NotFoundException(new MessageDto('El criterio no ha sido creada'))

            //asigna el criterio a la evaluacion
            const nombre_criterio = criterio_ind.cri_nombre;

            //busca si el indicador existe
            const indicador = await this.indicadorRepository.findOne({ where: { ind_id: dto.ind_sic_id } });
            if (!indicador) throw new NotFoundException(new MessageDto('El indicador no ha sido creada'))

            const cumplimiento = this.cumplimientoSicRepository.create(dto)
            
            //ASIGNAMOS LA FORANEA DE CUMPLIMIENTO CON CRITERIO_IND
            cumplimiento.criterio_sic=criterio_ind;

            //ASIGNAMOS LA FORANEA DE CUMPLIMIENTO CON EVALUACIÓN_PAMEC
            cumplimiento.cump_eva_sic=evaluacion_ind;

            //ASIGNAMOS LA FORANEA DE CUMPLIMIENTO CON INDICADOR
            cumplimiento.indicadorsic=indicador;


            await this.cumplimientoSicRepository.save(cumplimiento)
            // ASIGNAR LA AUDITORIA DE LA CALIFICACION ASIGNADO AL CRITERIO
            await this.auditoria_registro_services.logCreateCumplimientoSic(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                dto.cumpl_cumple,
                nombre_criterio,
                acta_idInd,
                year,
            );
            return new MessageDto('El cumplimiento ha sido Creado');
        } catch (error) {
            
        }
    
    }

    //LISTANDO CRITERIOS Y CUMPLIMIENTO POR EVALUACION
    async getCriCalIdeva(id: number): Promise<CumplimientoSicEntity[]> {
        const cumplimiento = await this.cumplimientoSicRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_sic.cri_id', 'criterio_sic.cri_nombre', 'eval_acta_sic.act_nombre_prestador',
                'eval_acta_sic.act_nombre_funcionario', 'eval_acta_sic.act_cargo_funcionario', 'eval_acta_sic.act_nombre_prestador',
                'indicadorsic.ind_id', 'indicadorsic.ind_nombre'])
            .innerJoin('cumplimiento.criterio_sic', 'criterio_sic')
            //.innerJoin('calificacion.cump_eva_sic', 'cump_eva_sic')
            .innerJoinAndSelect('cumplimiento.cump_eva_sic', 'cump_eva_sic')
            .innerJoinAndSelect('cump_eva_sic.eval_acta_sic', 'eval_acta_sic')
            .innerJoinAndSelect('cumplimiento.indicadorsic', 'indicadorsic')
            .where('cump_eva_sic.eva_id = :eva_id', { eva_id: id })
            .orderBy('criterio_sic.cri_id', 'ASC')
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //LISTANDO CRITERIOS Y CUMPLIMIENTO POR EVALUACION
    async getcumpliestandar(id: number): Promise<CumplimientoEstandarSicEntity[]> {
        const cumplimientoestandar = await this.cumplimientoEstandarSicRepository.createQueryBuilder('listado')
            .select(['listado'])
            .innerJoinAndSelect('listado.criterioestandar_sic', 'criterioestandar_sic')
            .innerJoinAndSelect('listado.cumplimiento_eva_sic', 'cumplimiento_eva_sic')
            .where('cumplimiento_eva_sic.eva_id = :eva_id', { eva_id: id })
            .getMany()
        if (!cumplimientoestandar) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimientoestandar
    }

    //EDITAR CUMPLIMIENTOS
    async edit(id: number,payloads: { dto: CumplimientoSicDto, tokenDto: TokenDto}): Promise<any> {
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

            const cumplimiento = await this.findById(id);
            if (!cumplimiento) {
                throw new NotFoundException(new MessageDto('El cumplimiento no existe'));
            }

            dto.cumpl_cumple ? cumplimiento.cumpl_cumple = dto.cumpl_cumple : cumplimiento.cumpl_cumple = cumplimiento.cumpl_cumple;
            dto.cumpl_observaciones ? cumplimiento.cumpl_observaciones = dto.cumpl_observaciones : cumplimiento.cumpl_observaciones = cumplimiento.cumpl_observaciones;

            //busca si la evaluacion existe
            const evaluacion = await this.evaluacionsicRepository.findOne({ where: { eva_id: dto.eva_sic_id }, relations: ['eval_acta_sic'] });
            if (!evaluacion) throw new NotFoundException(new MessageDto('La evaluacion no ha sido creada'))

            //busca si el criterio existe
            const criterio = await this.criterioSicRepository.findOne({ where: { cri_id: dto.cri_sic_id } });
            if (!criterio) throw new NotFoundException(new MessageDto('El criterio no ha sido creada'))

            //busca si el indicador existe
            const indicador = await this.indicadorRepository.findOne({ where: { ind_id: dto.ind_sic_id } });
            if (!indicador) throw new NotFoundException(new MessageDto('El indicador no ha sido creada'))

            //asigna la evaluacion a la calificacion
            const acta_idInd = evaluacion.eval_acta_sic.act_id;
            //asigna el criterio a la evaluacion
            const nombre_criterio = criterio.cri_nombre;

            await this.cumplimientoSicRepository.save(cumplimiento);
            // ASIGNAR LA AUDITORIA DE LA CALIFICACION ASIGNADO AL CRITERIO
            await this.auditoria_actualizacion_services.logUpdateCumplimientoSic(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                dto.cumpl_cumple,
                nombre_criterio,
                acta_idInd,
                year,
            );

            return new MessageDto(`El cumplimiento ha sido Editado`);
        } catch (error) {
            // Aquí puedes manejar el error como desees, por ejemplo, registrarlo o lanzar una excepción personalizada.
            throw error;
        }
    }
}
