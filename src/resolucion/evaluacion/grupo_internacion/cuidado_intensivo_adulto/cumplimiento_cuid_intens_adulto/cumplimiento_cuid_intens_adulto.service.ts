import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidIntensAdultoEntity } from '../criterio_cuid_intens_adulto.entity';
import { CriterioCuidIntensAdultoRepository } from '../criterio_cuid_intens_adulto.repository';
import { CumplimientoIntAdultoEntity } from '../cumplimiento_cuid_intens_adulto.entity';
import { CumplimientoIntAdultoRepository } from '../cumplimiento_cuid_intens_adulto.repository';
import { CumplimientoCuidIntensAdultoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_adulto_dto/cumplimiento_cuid_intens_adulto.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoCuidIntensAdultoService {

    constructor(
        @InjectRepository(CumplimientoIntAdultoEntity)
        private readonly cumplimientoIntAdultoRepository: CumplimientoIntAdultoRepository,
        @InjectRepository(CriterioCuidIntensAdultoEntity)
        private readonly criterioCuidIntensAdultoRepository: CriterioCuidIntensAdultoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_cui_int_adul_id: number): Promise<CumplimientoIntAdultoEntity> {
        const cumplimiento = await this.cumplimientoIntAdultoRepository.findOne({ where: { cump_cui_int_adul_id } });
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
    async create(cri_int_adult_id: number, eva_id: number, dto: CumplimientoCuidIntensAdultoDto): Promise<any> {
        const criterio = await this.criterioCuidIntensAdultoRepository.findOne({ where: { cri_int_adult_id: cri_int_adult_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoIntAdultoRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cuid_int_adulto = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_intens_adul = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoIntAdultoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoIntAdultoRepository.delete(cumplimiento.cump_cui_int_adul_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoCuidIntensAdultoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_cui_int_adul_cumple ? cumplimiento.cump_cui_int_adul_cumple = dto.cump_cui_int_adul_cumple : cumplimiento.cump_cui_int_adul_cumple = cumplimiento.cump_cui_int_adul_cumple;
        dto.cump_cui_int_adul_hallazgo ? cumplimiento.cump_cui_int_adul_hallazgo = dto.cump_cui_int_adul_hallazgo : cumplimiento.cump_cui_int_adul_hallazgo = cumplimiento.cump_cui_int_adul_hallazgo;
        dto.cump_cui_int_adul_accion ? cumplimiento.cump_cui_int_adul_accion = dto.cump_cui_int_adul_accion : cumplimiento.cump_cui_int_adul_accion = cumplimiento.cump_cui_int_adul_accion;
        dto.cump_cui_int_adul_responsable ? cumplimiento.cump_cui_int_adul_responsable = dto.cump_cui_int_adul_responsable : cumplimiento.cump_cui_int_adul_responsable = cumplimiento.cump_cui_int_adul_responsable;
        dto.cump_cui_int_adul_fecha_limite ? cumplimiento.cump_cui_int_adul_fecha_limite = dto.cump_cui_int_adul_fecha_limite : cumplimiento.cump_cui_int_adul_fecha_limite = cumplimiento.cump_cui_int_adul_fecha_limite;
        
        await this.cumplimientoIntAdultoRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
