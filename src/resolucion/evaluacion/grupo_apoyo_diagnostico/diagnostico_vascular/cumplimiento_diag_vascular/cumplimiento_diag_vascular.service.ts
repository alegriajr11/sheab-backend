import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CumplimientoDiagnosticoVascularEntity } from '../cumplimiento_diagnost_vascular.entity';
import { CriterioDiagnostVascularEntity } from '../criterio_diagnost_vascular.entity';
import { CriterioDiagnostVascularRepository } from '../criterio_diagnost_vascular.repository';
import { CumplimientoDiagnRepository } from '../cumplimiento_diagnost_vascular.repository';
import {CumplimientoDiagnostiVascularDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/diagnostico_vascular_dto/cumplimiento_diagnostico_vascular.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoDiagVascularService {

    constructor(
        @InjectRepository(CumplimientoDiagnosticoVascularEntity)
        private readonly cumplimientoDiagnostVascularRepository: CumplimientoDiagnRepository,
        @InjectRepository(CriterioDiagnostVascularEntity)
        private readonly criterioDiagnostVascularRepository: CriterioDiagnostVascularRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_diagv_id: number): Promise<CumplimientoDiagnosticoVascularEntity> {
        const cumplimiento = await this.cumplimientoDiagnostVascularRepository.findOne({ where: { cump_diagv_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoDiagnosticoVascularEntity[]> {
        const cumplimiento = await this.cumplimientoDiagnostVascularRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_diag_vascular.cridiagv_nombre_criterio','diagnostico_vascular.diag_vas_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_diag_vascular', 'criterio_diag_vascular')
            .innerJoin('cumplimiento.cump_eva_diag_vas', 'cump_eva_diag_vas')
            .innerJoin('criterio_diag_vascular.diagnostico_vascular', 'diagnostico_vascular')
            .where('cump_eva_diag_vas.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }


    //METODO CREAR CUMPLIMIENTO
    async create(crivac_id: number, eva_id: number, dto: CumplimientoDiagnostiVascularDto): Promise<any> {
        const criterio = await this.criterioDiagnostVascularRepository.findOne({ where: { cri_apoyo_id: crivac_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoDiagnostVascularRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_diag_vascular = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_diag_vas = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoDiagnostVascularRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CUMPLIMIENTO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoDiagnostVascularRepository.delete(cumplimiento.cump_diagv_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoDiagnostiVascularDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_diagv_cumple ? cumplimiento.cump_diagv_cumple = dto.cump_diagv_cumple : cumplimiento.cump_diagv_cumple = cumplimiento.cump_diagv_cumple;
        dto.cump_diagv_hallazgo ? cumplimiento.cump_diagv_hallazgo = dto.cump_diagv_hallazgo : cumplimiento.cump_diagv_hallazgo = cumplimiento.cump_diagv_hallazgo;
        dto.cump_diagv_accion ? cumplimiento.cump_diagv_accion = dto.cump_diagv_accion : cumplimiento.cump_diagv_accion = cumplimiento.cump_diagv_accion;
        dto.cump_diagv_responsable ? cumplimiento.cump_diagv_responsable = dto.cump_diagv_responsable : cumplimiento.cump_diagv_responsable = cumplimiento.cump_diagv_responsable;
        dto.cump_diagv_fecha_limite ? cumplimiento.cump_diagv_fecha_limite = dto.cump_diagv_fecha_limite : cumplimiento.cump_diagv_fecha_limite = cumplimiento.cump_diagv_fecha_limite;
        
        await this.cumplimientoDiagnostVascularRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
