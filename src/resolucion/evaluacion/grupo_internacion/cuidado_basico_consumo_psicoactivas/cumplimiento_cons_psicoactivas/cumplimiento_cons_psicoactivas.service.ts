import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioConsumoPsicoactivasEntity } from '../criterio_cuid_cons_psicoact.entity';
import { CriterioConsumoPsicoactivasRepository } from '../criterio_cuid_cons_psicoact.repository';
import { CumplimientoConsPsicoactivasEntity } from '../cumplimiento_cuid_cons_psicoact.entity';
import { CumplimientoConsPsicoactivasRepository } from '../cumplimiento_cuid_cons_psicoact.repository';
import { CumplimientoConsumoPsicoactivasDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_basico_consumo_psicoactivas_dto/cumplimiento_cuid_cons_psicoact.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoConsPsicoactivasService {

    constructor(
        @InjectRepository(CumplimientoConsPsicoactivasEntity)
        private readonly cumplimientoConsPsicoactivasRepository: CumplimientoConsPsicoactivasRepository,
        @InjectRepository(CriterioConsumoPsicoactivasEntity)
        private readonly criterioConsumoPsicoactivasRepository: CriterioConsumoPsicoactivasRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_cons_psic_id: number): Promise<CumplimientoConsPsicoactivasEntity> {
        const cumplimiento = await this.cumplimientoConsPsicoactivasRepository.findOne({ where: { cump_cons_psic_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoConsPsicoactivasEntity[]> {
        const cumplimiento = await this.cumplimientoConsPsicoactivasRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_cons_psico.cri_cons_psic_nombre_criterio', 'cons_psicoactivas.cons_psi_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_cons_psico', 'criterio_cons_psico')
            .innerJoin('cumplimiento.cump_eva_cons_psico', 'cump_eva_cons_psico')
            .innerJoin('criterio_cons_psico.cons_psicoactivas', 'cons_psicoactivas')
            .where('cump_eva_cons_psico.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }
    
    //METODO CREAR CUMPLIMIENTO
    async create(cri_cons_psic_id: number, eva_id: number, dto: CumplimientoConsumoPsicoactivasDto): Promise<any> {
        const criterio = await this.criterioConsumoPsicoactivasRepository.findOne({ where: { cri_cons_psic_id: cri_cons_psic_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoConsPsicoactivasRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cons_psico = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_cons_psico = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoConsPsicoactivasRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CUMPLIMIENTO CUIDADO BASICO CONSUMO PSICOACTIVAS
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoConsPsicoactivasRepository.delete(cumplimiento.cump_cons_psic_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CUMPLIMIENTO CUIDADO BASICO CONSUMO PSICOACTIVAS
    async updateCapacidad(id: number, dto: CumplimientoConsumoPsicoactivasDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_cons_psic_cumple ? cumplimiento.cump_cons_psic_cumple = dto.cump_cons_psic_cumple : cumplimiento.cump_cons_psic_cumple = cumplimiento.cump_cons_psic_cumple;
        dto.cump_cons_psic_hallazgo ? cumplimiento.cump_cons_psic_hallazgo = dto.cump_cons_psic_hallazgo : cumplimiento.cump_cons_psic_hallazgo = cumplimiento.cump_cons_psic_hallazgo;
        dto.cump_cons_psic_accion ? cumplimiento.cump_cons_psic_accion = dto.cump_cons_psic_accion : cumplimiento.cump_cons_psic_accion = cumplimiento.cump_cons_psic_accion;
        dto.cump_cons_psic_responsable ? cumplimiento.cump_cons_psic_responsable = dto.cump_cons_psic_responsable : cumplimiento.cump_cons_psic_responsable = cumplimiento.cump_cons_psic_responsable;
        dto.cump_cons_psic_fecha_limite ? cumplimiento.cump_cons_psic_fecha_limite = dto.cump_cons_psic_fecha_limite : cumplimiento.cump_cons_psic_fecha_limite = cumplimiento.cump_cons_psic_fecha_limite;
        
        await this.cumplimientoConsPsicoactivasRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
