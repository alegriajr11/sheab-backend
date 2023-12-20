import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioExternaGeneralEntity } from '../criterio_ext_general.entity';
import { CriterioExternaGeneralRepository } from '../criterio_ext_general.repository';
import { CumplimientoExternaGeneralEntity } from '../cumplimiento_ext_general.entity';
import { CumplimientoExternaGeneralRepository } from '../cumplimiento_ext_general.repository';
import { CumplimientoExternaGeneralDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/externa_general_dto/cumplimiento_ext_general.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoExtGeneralService {

    constructor(
        @InjectRepository(CumplimientoExternaGeneralEntity)
        private readonly cumplimientoExternaGeneralRepository: CumplimientoExternaGeneralRepository,
        @InjectRepository(CriterioExternaGeneralEntity)
        private readonly criterioExternaGeneralRepository: CriterioExternaGeneralRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_extg_id: number): Promise<CumplimientoExternaGeneralEntity> {
        const cumplimiento = await this.cumplimientoExternaGeneralRepository.findOne({ where: { cump_extg_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoExternaGeneralEntity[]> {
        const cumplimiento = await this.cumplimientoExternaGeneralRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_externa_general.criextg_nombre_criterio', 'externa_general.extg_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_externa_general', 'criterio_externa_general')
            .innerJoin('cumplimiento.cump_eva_general', 'cump_eva_general')
            .innerJoin('criterio_externa_general.externa_general', 'externa_general')
            .where('cump_eva_general.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }
    
    //METODO CREAR CUMPLIMIENTO
    async create(criextg_id: number, eva_id: number, dto: CumplimientoExternaGeneralDto): Promise<any> {
        const criterio = await this.criterioExternaGeneralRepository.findOne({ where: { criextg_id: criextg_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoExternaGeneralRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_externa_general = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_general = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoExternaGeneralRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CUMPLIMIENTO EXTERNA GENERAL
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoExternaGeneralRepository.delete(cumplimiento.cump_extg_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CUMPLIMIENTO EXTERNA GENERAL
    async updateCapacidad(id: number, dto: CumplimientoExternaGeneralDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_extg_cumple ? cumplimiento.cump_extg_cumple = dto.cump_extg_cumple : cumplimiento.cump_extg_cumple = cumplimiento.cump_extg_cumple;
        dto.cump_extg_hallazgo ? cumplimiento.cump_extg_hallazgo = dto.cump_extg_hallazgo : cumplimiento.cump_extg_hallazgo = cumplimiento.cump_extg_hallazgo;
        dto.cump_extg_accion ? cumplimiento.cump_extg_accion = dto.cump_extg_accion : cumplimiento.cump_extg_accion = cumplimiento.cump_extg_accion;
        dto.cump_extg_responsable ? cumplimiento.cump_extg_responsable = dto.cump_extg_responsable : cumplimiento.cump_extg_responsable = cumplimiento.cump_extg_responsable;
        dto.cump_extg_fecha_limite ? cumplimiento.cump_extg_fecha_limite = dto.cump_extg_fecha_limite : cumplimiento.cump_extg_fecha_limite = cumplimiento.cump_extg_fecha_limite;
        
        await this.cumplimientoExternaGeneralRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
