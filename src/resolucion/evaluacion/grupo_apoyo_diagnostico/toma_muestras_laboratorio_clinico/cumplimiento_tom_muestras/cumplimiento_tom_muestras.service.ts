import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioMuestraLabClinicoEntity } from '../criterio_tom_muestras.entity';
import { CriterioMuestraLabClinicoRepository } from '../criterio_tom_muestras.repository';
import { CumplimientoMuestLabClinicoEntity } from '../cumplimiento_tom_muestras.entity';
import { CumplimientoMuestLabClinicoRepository } from '../cumplimiento_tom_muestras.repository';
import { CumplimientoMuestraLabClinicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/toma_muestras_laboratorio_clinico_dto/cumplimiento_tom_muestras.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoTomMuestrasService {

    constructor(
        @InjectRepository(CumplimientoMuestLabClinicoEntity)
        private readonly cumplimientoMuestLabClinicoRepository: CumplimientoMuestLabClinicoRepository,
        @InjectRepository(CriterioMuestraLabClinicoEntity)
        private readonly criterioMuestraLabClinicoRepository: CriterioMuestraLabClinicoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_mues_clin_id: number): Promise<CumplimientoMuestLabClinicoEntity> {
        const cumplimiento = await this.cumplimientoMuestLabClinicoRepository.findOne({ where: { cump_mues_clin_id } });
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
    async create(cri_muest_cli_id: number, eva_id: number, dto: CumplimientoMuestraLabClinicoDto): Promise<any> {
        const criterio = await this.criterioMuestraLabClinicoRepository.findOne({ where: { cri_muest_cli_id: cri_muest_cli_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoMuestLabClinicoRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_muest_lab_clinico = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_toma_muestras_lab_cli = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoMuestLabClinicoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoMuestLabClinicoRepository.delete(cumplimiento.cump_mues_clin_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoMuestraLabClinicoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_mues_clin_cumple ? cumplimiento.cump_mues_clin_cumple = dto.cump_mues_clin_cumple : cumplimiento.cump_mues_clin_cumple = cumplimiento.cump_mues_clin_cumple;
        dto.cump_mues_clin_hallazgo ? cumplimiento.cump_mues_clin_hallazgo = dto.cump_mues_clin_hallazgo : cumplimiento.cump_mues_clin_hallazgo = cumplimiento.cump_mues_clin_hallazgo;
        dto.cump_mues_clin_accion ? cumplimiento.cump_mues_clin_accion = dto.cump_mues_clin_accion : cumplimiento.cump_mues_clin_accion = cumplimiento.cump_mues_clin_accion;
        dto.cump_mues_clin_responsable ? cumplimiento.cump_mues_clin_responsable = dto.cump_mues_clin_responsable : cumplimiento.cump_mues_clin_responsable = cumplimiento.cump_mues_clin_responsable;
        dto.cump_mues_clin_fecha_limite ? cumplimiento.cump_mues_clin_fecha_limite = dto.cump_mues_clin_fecha_limite : cumplimiento.cump_mues_clin_fecha_limite = cumplimiento.cump_mues_clin_fecha_limite;
        
        await this.cumplimientoMuestLabClinicoRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
