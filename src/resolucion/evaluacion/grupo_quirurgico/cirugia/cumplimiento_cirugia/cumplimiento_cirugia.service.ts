import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCirugiaEntity } from '../criterio_cirugia.entity';
import { CriterioCirugiaRepository } from '../criterio_cirugia.repository';
import { CumplimientoCirugiaEntity } from '../cumplimiento_cirugia.entity';
import { CumplimientoCirugiaRepository } from '../cumplimiento_cirugia.repository';
import { CumplimientoCirugiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_quirurgico_dtos/cirugia_dto/cumplimiento_cirugia.dto';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Injectable()
export class CumplimientoCirugiaService {

    constructor(
        @InjectRepository(CumplimientoCirugiaEntity)
        private readonly cumplimientoCirugiaRepository: CumplimientoCirugiaRepository,
        @InjectRepository(CriterioCirugiaEntity)
        private readonly criterioCirugiaRepository: CriterioCirugiaRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_ciru_id: number): Promise<CumplimientoCirugiaEntity> {
        const cumplimiento = await this.cumplimientoCirugiaRepository.findOne({ where: { cump_ciru_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoCirugiaEntity[]> {
        const cumplimiento = await this.cumplimientoCirugiaRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_cirugia.cri_ciru_nombre_criterio', 'cirugia.ciru_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_cirugia', 'criterio_cirugia')
            .innerJoin('cumplimiento.cump_eva_cirugia', 'cump_eva_cirugia')
            .innerJoin('criterio_cirugia.cirugia', 'cirugia')
            .where('cump_eva_cirugia.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }
    
    //METODO CREAR CUMPLIMIENTO
    async create(cri_ciru_id: number, eva_id: number, dto: CumplimientoCirugiaDto): Promise<any> {
        const criterio = await this.criterioCirugiaRepository.findOne({ where: { cri_ciru_id: cri_ciru_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoCirugiaRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cirugia = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_cirugia = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoCirugiaRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CUMPLIMIENTO CIRUGIA
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoCirugiaRepository.delete(cumplimiento.cump_ciru_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CUMPLIMIENTO CIRUGIA
    async updateCapacidad(id: number, dto: CumplimientoCirugiaDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_ciru_cumple ? cumplimiento.cump_ciru_cumple = dto.cump_ciru_cumple : cumplimiento.cump_ciru_cumple = cumplimiento.cump_ciru_cumple;
        dto.cump_ciru_hallazgo ? cumplimiento.cump_ciru_hallazgo = dto.cump_ciru_hallazgo : cumplimiento.cump_ciru_hallazgo = cumplimiento.cump_ciru_hallazgo;
        dto.cump_ciru_accion ? cumplimiento.cump_ciru_accion = dto.cump_ciru_accion : cumplimiento.cump_ciru_accion = cumplimiento.cump_ciru_accion;
        dto.cump_ciru_responsable ? cumplimiento.cump_ciru_responsable = dto.cump_ciru_responsable : cumplimiento.cump_ciru_responsable = cumplimiento.cump_ciru_responsable;
        dto.cump_ciru_fecha_limite ? cumplimiento.cump_ciru_fecha_limite = dto.cump_ciru_fecha_limite : cumplimiento.cump_ciru_fecha_limite = cumplimiento.cump_ciru_fecha_limite;
        
        await this.cumplimientoCirugiaRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
