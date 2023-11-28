import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuelloUterinoEntity } from '../criterio_tom_muest_cuello.entity';
import { CriterioCuelloUterinoRepository } from '../criterio_tom_muest_cuello.repository';
import { CumplimientoCuelloUterinoEntity } from '../cumplimiento_tom_muest_cuello.entity';
import { CumplimientoCuelloUterinoRepository } from '../cumplimiento_tom_muest_cuello.repository';
import { CumplimientoCuelloUterinoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/toma_muestras_cuello_uterino_dto/cumplimiento_tom_muest_cuello.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoMuesCuelloService {

    constructor(
        @InjectRepository(CumplimientoCuelloUterinoEntity)
        private readonly cumplimientoCuelloUterinoRepository: CumplimientoCuelloUterinoRepository,
        @InjectRepository(CriterioCuelloUterinoEntity)
        private readonly criterioCuelloUterinoRepository: CriterioCuelloUterinoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_cue_uter_id: number): Promise<CumplimientoCuelloUterinoEntity> {
        const cumplimiento = await this.cumplimientoCuelloUterinoRepository.findOne({ where: { cump_cue_uter_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    //     //LISTANDO CAPACIDAD POR PRESTADOR
    // async getServicioForPrestador(id: string): Promise<CapacidadInstaladaEntity[]> {
    //     const servicio_prestador = await this.capacidadInstaladaRepository.createQueryBuilder('servicio')
    //     .select(['servicio', 'prestadores.pre_nombre'])
    //     .innerJoin('servicio.prestadores', 'prestadores')
    //     .where('prestadores.pre_cod_habilitacion = :servi_pres', { servi_pres : id})
    //     .getMany()
    //     if (!servicio_prestador) throw new NotFoundException(new MessageDto('No Existe en la lista'))
    //     return servicio_prestador
    // }

    //METODO CREAR CUMPLIMIENTO
    async create(cri_cuel_ute_id: number, eva_id: number, dto: CumplimientoCuelloUterinoDto): Promise<any> {
        const criterio = await this.criterioCuelloUterinoRepository.findOne({ where: { cri_cuel_ute_id: cri_cuel_ute_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoCuelloUterinoRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cuello_uterino = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_cuello_uterino = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoCuelloUterinoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoCuelloUterinoRepository.delete(cumplimiento.cump_cue_uter_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoCuelloUterinoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_cue_uter_cumple ? cumplimiento.cump_cue_uter_cumple = dto.cump_cue_uter_cumple : cumplimiento.cump_cue_uter_cumple = cumplimiento.cump_cue_uter_cumple;
        dto.cump_cue_uter_hallazgo ? cumplimiento.cump_cue_uter_hallazgo = dto.cump_cue_uter_hallazgo : cumplimiento.cump_cue_uter_hallazgo = cumplimiento.cump_cue_uter_hallazgo;
        dto.cump_cue_uter_accion ? cumplimiento.cump_cue_uter_accion = dto.cump_cue_uter_accion : cumplimiento.cump_cue_uter_accion = cumplimiento.cump_cue_uter_accion;
        dto.cump_cue_uter_responsable ? cumplimiento.cump_cue_uter_responsable = dto.cump_cue_uter_responsable : cumplimiento.cump_cue_uter_responsable = cumplimiento.cump_cue_uter_responsable;
        dto.cump_cue_uter_fecha_limite ? cumplimiento.cump_cue_uter_fecha_limite = dto.cump_cue_uter_fecha_limite : cumplimiento.cump_cue_uter_fecha_limite = cumplimiento.cump_cue_uter_fecha_limite;
        
        await this.cumplimientoCuelloUterinoRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
