import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntermNeonatalEntity } from '../criterio_cuid_inter_neonatal.entity';
import { CriterioCuidIntermNeonatalRepository } from '../criterio_cuid_inter_neonatal.repository';
import { CumplimientoCuidInterNeonatalEntity } from '../cumplimiento_cuid_inter_neonatal.entity';
import { CumplimientoCuidInterNeonatalRepository } from '../cumplimiento_cuid_inter_neonatal.repository';
import { CumplimientoCuidIntermNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_neonatal_dto/cumplimiento_cuid_inter_neonatal.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoCuidInterNeonatalService {

    constructor(
        @InjectRepository(CumplimientoCuidInterNeonatalEntity)
        private readonly cumplimientoCuidInterNeonatalRepository: CumplimientoCuidInterNeonatalRepository,
        @InjectRepository(CriterioCuidIntermNeonatalEntity)
        private readonly criterioCuidIntermNeonatalRepository: CriterioCuidIntermNeonatalRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_inter_neona_id: number): Promise<CumplimientoCuidInterNeonatalEntity> {
        const cumplimiento = await this.cumplimientoCuidInterNeonatalRepository.findOne({ where: { cump_inter_neona_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoCuidInterNeonatalEntity[]> {
        const cumplimiento = await this.cumplimientoCuidInterNeonatalRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_cuid_inter_neona.cri_inter_neon_nombre_criterio', 'cuid_inter_neonatal.cuid_inter_adult_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_cuid_inter_neona', 'criterio_cuid_inter_neona')
            .innerJoin('cumplimiento.cump_eva_inter_neo', 'cump_eva_inter_neo')
            .innerJoin('criterio_cuid_inter_neona.cuid_inter_neonatal', 'cuid_inter_neonatal')
            .where('cump_eva_inter_neo.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }
    
    //METODO CREAR CUMPLIMIENTO
    async create(cri_inter_neon_id: number, eva_id: number, dto: CumplimientoCuidIntermNeonatalDto): Promise<any> {
        const criterio = await this.criterioCuidIntermNeonatalRepository.findOne({ where: { cri_inter_neon_id: cri_inter_neon_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoCuidInterNeonatalRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cuid_inter_neona = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_inter_neo = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoCuidInterNeonatalRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CUMPLIMIENTO CUIDADO INTERMEDIO NEONATAL
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoCuidInterNeonatalRepository.delete(cumplimiento.cump_inter_neona_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CUMPLIMIENTO CUIDADO INTERMEDIO NEONATAL
    async updateCapacidad(id: number, dto: CumplimientoCuidIntermNeonatalDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_inter_neona_cumple ? cumplimiento.cump_inter_neona_cumple = dto.cump_inter_neona_cumple : cumplimiento.cump_inter_neona_cumple = cumplimiento.cump_inter_neona_cumple;
        dto.cump_inter_neona_hallazgo ? cumplimiento.cump_inter_neona_hallazgo = dto.cump_inter_neona_hallazgo : cumplimiento.cump_inter_neona_hallazgo = cumplimiento.cump_inter_neona_hallazgo;
        dto.cump_inter_neona_accion ? cumplimiento.cump_inter_neona_accion = dto.cump_inter_neona_accion : cumplimiento.cump_inter_neona_accion = cumplimiento.cump_inter_neona_accion;
        dto.cump_inter_neona_responsable ? cumplimiento.cump_inter_neona_responsable = dto.cump_inter_neona_responsable : cumplimiento.cump_inter_neona_responsable = cumplimiento.cump_inter_neona_responsable;
        dto.cump_inter_neona_fecha_limite ? cumplimiento.cump_inter_neona_fecha_limite = dto.cump_inter_neona_fecha_limite : cumplimiento.cump_inter_neona_fecha_limite = cumplimiento.cump_inter_neona_fecha_limite;
        
        await this.cumplimientoCuidInterNeonatalRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
