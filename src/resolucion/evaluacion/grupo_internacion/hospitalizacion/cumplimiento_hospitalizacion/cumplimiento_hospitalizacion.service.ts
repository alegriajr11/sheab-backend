import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CumplimientoHospitalizacionEntity } from '../cumplimiento_hospitalizacion.entity';
import { CumplimientoHospitalizacionRepository } from '../cumplimiento_hospitalizacion.repository';
import { CriterioHospitalizacionEntity } from '../criterio_hospitalizacion.entity';
import { CriterioHospitalizacionRepository } from '../criterio_hospitalizacion.repository';
import { MessageDto } from 'src/common/message.dto';
import { CumplimientoHospitalizacionDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_dto/cumplimiento_hospitalizacion.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoHospitalizacionService {

    constructor(
        @InjectRepository(CumplimientoHospitalizacionEntity)
        private readonly cumplimientoHospitalizacionRepository: CumplimientoHospitalizacionRepository,
        @InjectRepository(CriterioHospitalizacionEntity)
        private readonly criterioHospitalizacionRepository: CriterioHospitalizacionRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_hosp_id: number): Promise<CumplimientoHospitalizacionEntity> {
        const cumplimiento = await this.cumplimientoHospitalizacionRepository.findOne({ where: { cump_hosp_id } });
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
    async create(crihosp_id: number, eva_id: number, dto: CumplimientoHospitalizacionDto): Promise<any> {
        const criterio = await this.criterioHospitalizacionRepository.findOne({ where: { crihosp_id: crihosp_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoHospitalizacionRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_hospitalizacion = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_hospi = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoHospitalizacionRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoHospitalizacionRepository.delete(cumplimiento.cump_hosp_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoHospitalizacionDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_hosp_cumple ? cumplimiento.cump_hosp_cumple = dto.cump_hosp_cumple : cumplimiento.cump_hosp_cumple = cumplimiento.cump_hosp_cumple;
        dto.cump_hosp_hallazgo ? cumplimiento.cump_hosp_hallazgo = dto.cump_hosp_hallazgo : cumplimiento.cump_hosp_hallazgo = cumplimiento.cump_hosp_hallazgo;
        dto.cump_hosp_accion ? cumplimiento.cump_hosp_accion = dto.cump_hosp_accion : cumplimiento.cump_hosp_accion = cumplimiento.cump_hosp_accion;
        dto.cump_hosp_responsable ? cumplimiento.cump_hosp_responsable = dto.cump_hosp_responsable : cumplimiento.cump_hosp_responsable = cumplimiento.cump_hosp_responsable;
        dto.cump_hosp_fecha_limite ? cumplimiento.cump_hosp_fecha_limite = dto.cump_hosp_fecha_limite : cumplimiento.cump_hosp_fecha_limite = cumplimiento.cump_hosp_fecha_limite;
        
        await this.cumplimientoHospitalizacionRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
