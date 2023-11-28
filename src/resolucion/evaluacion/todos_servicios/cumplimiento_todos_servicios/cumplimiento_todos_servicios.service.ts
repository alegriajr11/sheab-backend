import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { Criterio_servicios } from '../servicios/criterio_servicios.entity';
import { CriterioServiciosRepository } from '../servicios/criterio_servicios.repository';
import { CumplimientoServiciosEntity } from '../servicios/cumplimiento_servicios.entity';
import { CumplimientoServiciosRepository } from '../servicios/cumplimiento_servicios.repository';
import { CumplimientoServiciosDto } from 'src/resolucion/dtos/evaluacion_dtos/todos_servicios_dto/servicios_dto/cumplimiento_servicios.dto';
import { EvaluacionResVerificacionEntity } from '../../evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from '../../evaluacion_resolucion_verificacion/evaluacion_res.repository';


@Injectable()
export class CumplimientoTodosServiciosService {

    constructor(
        @InjectRepository(CumplimientoServiciosEntity)
        private readonly cumplimientoServiciosRepository: CumplimientoServiciosRepository,
        @InjectRepository(Criterio_servicios)
        private readonly criterioServiciosRepository: CriterioServiciosRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cumps_id: number): Promise<CumplimientoServiciosEntity> {
        const cumplimiento = await this.cumplimientoServiciosRepository.findOne({ where: { cumps_id } });
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
    async create(cris_id: number, eva_id: number, dto: CumplimientoServiciosDto): Promise<any> {
        const criterio = await this.criterioServiciosRepository.findOne({ where: { cris_id: cris_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoServiciosRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_servicios = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_todos_servi = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoServiciosRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoServiciosRepository.delete(cumplimiento.cumps_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoServiciosDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cumps_cumple ? cumplimiento.cumps_cumple = dto.cumps_cumple : cumplimiento.cumps_cumple = cumplimiento.cumps_cumple;
        dto.cumps_hallazgo ? cumplimiento.cumps_hallazgo = dto.cumps_hallazgo : cumplimiento.cumps_hallazgo = cumplimiento.cumps_hallazgo;
        dto.cumps_accion ? cumplimiento.cumps_accion = dto.cumps_accion : cumplimiento.cumps_accion = cumplimiento.cumps_accion;
        dto.cumps_responsable ? cumplimiento.cumps_responsable = dto.cumps_responsable : cumplimiento.cumps_responsable = cumplimiento.cumps_responsable;
        dto.cumps_fecha_limite ? cumplimiento.cumps_fecha_limite = dto.cumps_fecha_limite : cumplimiento.cumps_fecha_limite = cumplimiento.cumps_fecha_limite;
        
        await this.cumplimientoServiciosRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
