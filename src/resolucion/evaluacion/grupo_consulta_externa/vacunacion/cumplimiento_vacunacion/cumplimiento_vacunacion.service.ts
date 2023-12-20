import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioVacunacionEntity } from '../criterio_vacunacion.entity';
import { CriterioVacunacionRepository } from '../criterio_vacunacion.repository';
import { CumplimientoVacunacionEntity } from '../cumplimiento_vacunacion.entity';
import { CumplimientoVacunacionRepository } from '../cumplimiento_vacunacion.repository';
import { CumplimientoVacunacionDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/vacunacion_dto/cumplimiento_vacunacion.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoVacunacionService {

    constructor(
        @InjectRepository(CumplimientoVacunacionEntity)
        private readonly cumplimientoVacunacionRepository: CumplimientoVacunacionRepository,
        @InjectRepository(CriterioVacunacionEntity)
        private readonly criterioVacunacionRepository: CriterioVacunacionRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_vac_id: number): Promise<CumplimientoVacunacionEntity> {
        const cumplimiento = await this.cumplimientoVacunacionRepository.findOne({ where: { cump_vac_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoVacunacionEntity[]> {
        const cumplimiento = await this.cumplimientoVacunacionRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_vacunacion.crivac_nombre_criterio', 'vacunacion.vac_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_vacunacion', 'criterio_vacunacion')
            .innerJoin('cumplimiento.cump_eva_vacu', 'cump_eva_vacu')
            .innerJoin('criterio_vacunacion.vacunacion', 'vacunacion')
            .where('cump_eva_vacu.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }
    
    //METODO CREAR CUMPLIMIENTO
    async create(crivac_id: number, eva_id: number, dto: CumplimientoVacunacionDto): Promise<any> {
        const criterio = await this.criterioVacunacionRepository.findOne({ where: { crivac_id: crivac_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoVacunacionRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_vacunacion = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_vacu = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoVacunacionRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CUMPLIMIENTOS VACUNACION
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoVacunacionRepository.delete(cumplimiento.cump_vac_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CUMPLIMIENTOS VACUNACION
    async updateCapacidad(id: number, dto: CumplimientoVacunacionDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_vac_cumple ? cumplimiento.cump_vac_cumple = dto.cump_vac_cumple : cumplimiento.cump_vac_cumple = cumplimiento.cump_vac_cumple;
        dto.cump_vac_hallazgo ? cumplimiento.cump_vac_hallazgo = dto.cump_vac_hallazgo : cumplimiento.cump_vac_hallazgo = cumplimiento.cump_vac_hallazgo;
        dto.cump_vac_accion ? cumplimiento.cump_vac_accion = dto.cump_vac_accion : cumplimiento.cump_vac_accion = cumplimiento.cump_vac_accion;
        dto.cump_vac_responsable ? cumplimiento.cump_vac_responsable = dto.cump_vac_responsable : cumplimiento.cump_vac_responsable = cumplimiento.cump_vac_responsable;
        dto.cump_vac_fecha_limite ? cumplimiento.cump_vac_fecha_limite = dto.cump_vac_fecha_limite : cumplimiento.cump_vac_fecha_limite = cumplimiento.cump_vac_fecha_limite;
        
        await this.cumplimientoVacunacionRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
