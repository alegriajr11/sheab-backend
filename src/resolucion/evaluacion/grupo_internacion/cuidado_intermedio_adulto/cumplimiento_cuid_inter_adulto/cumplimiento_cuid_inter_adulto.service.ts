import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntermAdultoEntity } from '../criterio_cuid_inter_adulto.entity';
import { CriterioCuidIntermAdultoRepository } from '../criterio_cuid_inter_adulto.repository';
import { CumplimientoCuidInterAdultoEntity } from '../cumplimiento_cuid_inter_adulto.entity';
import { CumplimientoCuidInterAdultoRepository } from '../cumplimiento_cuid_inter_adulto.repository';
import { CumplimientoCuidIntermAdultoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_adulto_dto/cumplimiento_cuid_inter_adulto.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoCuidInterAdultoService {

    constructor(
        @InjectRepository(CumplimientoCuidInterAdultoEntity)
        private readonly cumplimientoCuidInterAdultoRepository: CumplimientoCuidInterAdultoRepository,
        @InjectRepository(CriterioCuidIntermAdultoEntity)
        private readonly criterioCuidIntermAdultoRepository: CriterioCuidIntermAdultoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_inter_adulto_id: number): Promise<CumplimientoCuidInterAdultoEntity> {
        const cumplimiento = await this.cumplimientoCuidInterAdultoRepository.findOne({ where: { cump_inter_adulto_id } });
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
    async create(cri_inter_adult_id: number, eva_id: number, dto: CumplimientoCuidIntermAdultoDto): Promise<any> {
        const criterio = await this.criterioCuidIntermAdultoRepository.findOne({ where: { cri_inter_adult_id: cri_inter_adult_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoCuidInterAdultoRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cuid_inter_adult = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_inter_adul = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoCuidInterAdultoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoCuidInterAdultoRepository.delete(cumplimiento.cump_inter_adulto_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoCuidIntermAdultoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_inter_adulto_cumple ? cumplimiento.cump_inter_adulto_cumple = dto.cump_inter_adulto_cumple : cumplimiento.cump_inter_adulto_cumple = cumplimiento.cump_inter_adulto_cumple;
        dto.cump_inter_adulto_hallazgo ? cumplimiento.cump_inter_adulto_hallazgo = dto.cump_inter_adulto_hallazgo : cumplimiento.cump_inter_adulto_hallazgo = cumplimiento.cump_inter_adulto_hallazgo;
        dto.cump_inter_adulto_accion ? cumplimiento.cump_inter_adulto_accion = dto.cump_inter_adulto_accion : cumplimiento.cump_inter_adulto_accion = cumplimiento.cump_inter_adulto_accion;
        dto.cump_inter_adulto_responsable ? cumplimiento.cump_inter_adulto_responsable = dto.cump_inter_adulto_responsable : cumplimiento.cump_inter_adulto_responsable = cumplimiento.cump_inter_adulto_responsable;
        dto.cump_inter_adulto_fecha_limite ? cumplimiento.cump_inter_adulto_fecha_limite = dto.cump_inter_adulto_fecha_limite : cumplimiento.cump_inter_adulto_fecha_limite = cumplimiento.cump_inter_adulto_fecha_limite;
        
        await this.cumplimientoCuidInterAdultoRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
