import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntePediatricoEntity } from '../criterio_cuid_intens_pediatrico.entity';
import { CriterioCuidIntePediatricoRepository } from '../criterio_cuid_intens_pediatrico.repository';
import { CumplimientoCuidIntPediatricoEntity } from '../cumplimiento_cuid_intens_pediatrico.entity';
import { CumplimientoCuidIntPediatricoRepository } from '../cumplimiento_cuid_intens_pediatrico.repository';
import { CumplimientoCuidIntePediatricoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_pediatrico_dto/cumplimiento_cuid_intens_pediatrico.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoCuidIntensPediatricoService {
    
    constructor(
        @InjectRepository(CumplimientoCuidIntPediatricoEntity)
        private readonly cumplimientoCuidIntPediatricoRepository: CumplimientoCuidIntPediatricoRepository,
        @InjectRepository(CriterioCuidIntePediatricoEntity)
        private readonly criterioCuidIntePediatricoRepository: CriterioCuidIntePediatricoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_int_ped_id: number): Promise<CumplimientoCuidIntPediatricoEntity> {
        const cumplimiento = await this.cumplimientoCuidIntPediatricoRepository.findOne({ where: { cump_int_ped_id } });
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
    async create(cri_int_ped_id: number, eva_id: number, dto: CumplimientoCuidIntePediatricoDto): Promise<any> {
        const criterio = await this.criterioCuidIntePediatricoRepository.findOne({ where: { cri_int_ped_id: cri_int_ped_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoCuidIntPediatricoRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cuid_int_pediatrico = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_intens_pedia = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoCuidIntPediatricoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoCuidIntPediatricoRepository.delete(cumplimiento.cump_int_ped_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoCuidIntePediatricoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_int_ped_cumple ? cumplimiento.cump_int_ped_cumple = dto.cump_int_ped_cumple : cumplimiento.cump_int_ped_cumple = cumplimiento.cump_int_ped_cumple;
        dto.cump_int_ped_hallazgo ? cumplimiento.cump_int_ped_hallazgo = dto.cump_int_ped_hallazgo : cumplimiento.cump_int_ped_hallazgo = cumplimiento.cump_int_ped_hallazgo;
        dto.cump_int_ped_accion ? cumplimiento.cump_int_ped_accion = dto.cump_int_ped_accion : cumplimiento.cump_int_ped_accion = cumplimiento.cump_int_ped_accion;
        dto.cump_int_ped_responsable ? cumplimiento.cump_int_ped_responsable = dto.cump_int_ped_responsable : cumplimiento.cump_int_ped_responsable = cumplimiento.cump_int_ped_responsable;
        dto.cump_int_ped_fecha_limite ? cumplimiento.cump_int_ped_fecha_limite = dto.cump_int_ped_fecha_limite : cumplimiento.cump_int_ped_fecha_limite = cumplimiento.cump_int_ped_fecha_limite;
        
        await this.cumplimientoCuidIntPediatricoRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}