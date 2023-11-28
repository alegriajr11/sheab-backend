import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntermPediatricoEntity } from '../criterio_cuid_inter_pediatrico.entity';
import { CriterioCuidIntermPediatricoRepository } from '../criterio_cuid_inter_pediatrico.repository';
import { CumplimientoCuidInterPediatricoEntity } from '../cumplimiento_cuid_inter_pediatrico.entity';
import { CumplimientoCuidInterPediatricoRepository } from '../cumplimiento_cuid_inter_pediatrico.repository';
import { CumplimientoCuidIntermPediatricoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_pediatrico_dto/cumplimiento_cuid_inter_pediatrico.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoCuidInterPediatricoService {

    constructor(
        @InjectRepository(CumplimientoCuidInterPediatricoEntity)
        private readonly cumplimientoCuidInterPediatricoRepository: CumplimientoCuidInterPediatricoRepository,
        @InjectRepository(CriterioCuidIntermPediatricoEntity)
        private readonly criterioCuidIntermPediatricoRepository: CriterioCuidIntermPediatricoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_inter_pedi_id: number): Promise<CumplimientoCuidInterPediatricoEntity> {
        const cumplimiento = await this.cumplimientoCuidInterPediatricoRepository.findOne({ where: { cump_inter_pedi_id } });
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
    async create(cri_inter_pedia_id: number, eva_id: number, dto: CumplimientoCuidIntermPediatricoDto): Promise<any> {
        const criterio = await this.criterioCuidIntermPediatricoRepository.findOne({ where: { cri_inter_pedia_id: cri_inter_pedia_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoCuidInterPediatricoRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cuid_inter_pedia = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_inter_pedi = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoCuidInterPediatricoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoCuidInterPediatricoRepository.delete(cumplimiento.cump_inter_pedi_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoCuidIntermPediatricoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_inter_pedi_cumple ? cumplimiento.cump_inter_pedi_cumple = dto.cump_inter_pedi_cumple : cumplimiento.cump_inter_pedi_cumple = cumplimiento.cump_inter_pedi_cumple;
        dto.cump_inter_pedi_hallazgo ? cumplimiento.cump_inter_pedi_hallazgo = dto.cump_inter_pedi_hallazgo : cumplimiento.cump_inter_pedi_hallazgo = cumplimiento.cump_inter_pedi_hallazgo;
        dto.cump_inter_pedi_accion ? cumplimiento.cump_inter_pedi_accion = dto.cump_inter_pedi_accion : cumplimiento.cump_inter_pedi_accion = cumplimiento.cump_inter_pedi_accion;
        dto.cump_inter_pedi_responsable ? cumplimiento.cump_inter_pedi_responsable = dto.cump_inter_pedi_responsable : cumplimiento.cump_inter_pedi_responsable = cumplimiento.cump_inter_pedi_responsable;
        dto.cump_inter_pedi_fecha_limite ? cumplimiento.cump_inter_pedi_fecha_limite = dto.cump_inter_pedi_fecha_limite : cumplimiento.cump_inter_pedi_fecha_limite = cumplimiento.cump_inter_pedi_fecha_limite;
        
        await this.cumplimientoCuidInterPediatricoRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
