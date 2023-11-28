import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioSaludTrabajoEntity } from '../criterios_salud_trabajo.entity';
import { CumplimientoSaludTrabajoEntity } from '../cumplimiento_salud_trabajo.entity';
import { CumplimientoSaludTrabajoRepository } from '../cumplimiento_salud_trabajo.repository';
import { CriterioSaludTrabajoRepository } from '../criterios_salud_trabajo.repository';
import { CumplimientoSaludTrabajoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/seguridad_salud_trabajo_dto/cumplimiento_salud_trabajo.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoSaludTrabajoService {

    constructor(
        @InjectRepository(CumplimientoSaludTrabajoEntity)
        private readonly cumplimientoSaludTrabajoRepository: CumplimientoSaludTrabajoRepository,
        @InjectRepository(CriterioSaludTrabajoEntity)
        private readonly criterioSaludTrabajoRepository: CriterioSaludTrabajoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_saltra_id: number): Promise<CumplimientoSaludTrabajoEntity> {
        const cumplimiento = await this.cumplimientoSaludTrabajoRepository.findOne({ where: { cump_saltra_id } });
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
    async create(crisaltra_id: number, eva_id: number, dto: CumplimientoSaludTrabajoDto): Promise<any> {
        const criterio = await this.criterioSaludTrabajoRepository.findOne({ where: { crisaltra_id: crisaltra_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoSaludTrabajoRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_salud_trabajo = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_salud = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoSaludTrabajoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoSaludTrabajoRepository.delete(cumplimiento.cump_saltra_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoSaludTrabajoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_saltra_cumple ? cumplimiento.cump_saltra_cumple = dto.cump_saltra_cumple : cumplimiento.cump_saltra_cumple = cumplimiento.cump_saltra_cumple;
        dto.cump_saltra_hallazgo ? cumplimiento.cump_saltra_hallazgo = dto.cump_saltra_hallazgo : cumplimiento.cump_saltra_hallazgo = cumplimiento.cump_saltra_hallazgo;
        dto.cump_saltra_accion ? cumplimiento.cump_saltra_accion = dto.cump_saltra_accion : cumplimiento.cump_saltra_accion = cumplimiento.cump_saltra_accion;
        dto.cump_saltra_responsable ? cumplimiento.cump_saltra_responsable = dto.cump_saltra_responsable : cumplimiento.cump_saltra_responsable = cumplimiento.cump_saltra_responsable;
        dto.cump_saltra_fecha_limite ? cumplimiento.cump_saltra_fecha_limite = dto.cump_saltra_fecha_limite : cumplimiento.cump_saltra_fecha_limite = cumplimiento.cump_saltra_fecha_limite;
        
        await this.cumplimientoSaludTrabajoRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
