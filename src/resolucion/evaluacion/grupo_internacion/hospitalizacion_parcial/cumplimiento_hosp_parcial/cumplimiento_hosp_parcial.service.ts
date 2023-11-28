import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioHospitalizacionParcialEntity } from '../criterio_hosp_parcial.entity';
import { CriterioHospitalizacionParcialRepository } from '../criterio_hosp_parcial.repository';
import { CumplimientoHospitalizacionParcialEntity } from '../cumplimiento_hosp_parcial.entity';
import { CumplimientoHospitalizacionParcialRepository } from '../cumplimiento_hosp_parcial.repository';
import { CumplimientoHospitalizacionParcialDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_parcial_dto/cumplimiento_hosp_parcial.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoHospParcialService {

    constructor(
        @InjectRepository(CumplimientoHospitalizacionParcialEntity)
        private readonly cumplimientoHospitalizacionParcialRepository: CumplimientoHospitalizacionParcialRepository,
        @InjectRepository(CriterioHospitalizacionParcialEntity)
        private readonly criterioHospitalizacionParcialRepository: CriterioHospitalizacionParcialRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_hosp_parc_id: number): Promise<CumplimientoHospitalizacionParcialEntity> {
        const cumplimiento = await this.cumplimientoHospitalizacionParcialRepository.findOne({ where: { cump_hosp_parc_id } });
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
    async create(crihosp_parc_id: number, eva_id: number, dto: CumplimientoHospitalizacionParcialDto): Promise<any> {
        const criterio = await this.criterioHospitalizacionParcialRepository.findOne({ where: { crihosp_parc_id: crihosp_parc_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoHospitalizacionParcialRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_hospitalizacion_parcial = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_hospi_parcial = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoHospitalizacionParcialRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoHospitalizacionParcialRepository.delete(cumplimiento.cump_hosp_parc_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoHospitalizacionParcialDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_hosp_parc_cumple ? cumplimiento.cump_hosp_parc_cumple = dto.cump_hosp_parc_cumple : cumplimiento.cump_hosp_parc_cumple = cumplimiento.cump_hosp_parc_cumple;
        dto.cump_hosp_parc_hallazgo ? cumplimiento.cump_hosp_parc_hallazgo = dto.cump_hosp_parc_hallazgo : cumplimiento.cump_hosp_parc_hallazgo = cumplimiento.cump_hosp_parc_hallazgo;
        dto.cump_hosp_parc_accion ? cumplimiento.cump_hosp_parc_accion = dto.cump_hosp_parc_accion : cumplimiento.cump_hosp_parc_accion = cumplimiento.cump_hosp_parc_accion;
        dto.cump_hosp_parc_responsable ? cumplimiento.cump_hosp_parc_responsable = dto.cump_hosp_parc_responsable : cumplimiento.cump_hosp_parc_responsable = cumplimiento.cump_hosp_parc_responsable;
        dto.cump_hosp_parc_fecha_limite ? cumplimiento.cump_hosp_parc_fecha_limite = dto.cump_hosp_parc_fecha_limite : cumplimiento.cump_hosp_parc_fecha_limite = cumplimiento.cump_hosp_parc_fecha_limite;
        
        await this.cumplimientoHospitalizacionParcialRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
