import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioLabHistotecnologiaEntity } from '../criterio_lab_histotec.entity';
import { CriterioLabHistotecnologiaRepository } from '../criterio_lab_histotec.repository';
import { CumplimientoLabHistotecnEntity } from '../cumplimiento_lab_histotec.entity';
import { CumplimientoLabHistotecnRepository } from '../cumplimiento_lab_histotec.repository';
import { CumplimientoLabHistotecnologiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_histotecnologia_dto/cumplimiento_lab_histotec.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoLabHistotecnologiaService {

    constructor(
        @InjectRepository(CumplimientoLabHistotecnEntity)
        private readonly cumplimientoLabHistotecnRepository: CumplimientoLabHistotecnRepository,
        @InjectRepository(CriterioLabHistotecnologiaEntity)
        private readonly criterioLabHistotecnologiaRepository: CriterioLabHistotecnologiaRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_labhistot_id: number): Promise<CumplimientoLabHistotecnEntity> {
        const cumplimiento = await this.cumplimientoLabHistotecnRepository.findOne({ where: { cump_labhistot_id } });
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
    async create(cri_lab_histo_id: number, eva_id: number, dto: CumplimientoLabHistotecnologiaDto): Promise<any> {
        const criterio = await this.criterioLabHistotecnologiaRepository.findOne({ where: { cri_lab_histo_id: cri_lab_histo_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoLabHistotecnRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_lab_histotecnologia = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_lab_histotec = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoLabHistotecnRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoLabHistotecnRepository.delete(cumplimiento.cump_labhistot_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoLabHistotecnologiaDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_labhistot_cumple ? cumplimiento.cump_labhistot_cumple = dto.cump_labhistot_cumple : cumplimiento.cump_labhistot_cumple = cumplimiento.cump_labhistot_cumple;
        dto.cump_labhistot_hallazgo ? cumplimiento.cump_labhistot_hallazgo = dto.cump_labhistot_hallazgo : cumplimiento.cump_labhistot_hallazgo = cumplimiento.cump_labhistot_hallazgo;
        dto.cump_labhistot_accion ? cumplimiento.cump_labhistot_accion = dto.cump_labhistot_accion : cumplimiento.cump_labhistot_accion = cumplimiento.cump_labhistot_accion;
        dto.cump_labhistot_responsable ? cumplimiento.cump_labhistot_responsable = dto.cump_labhistot_responsable : cumplimiento.cump_labhistot_responsable = cumplimiento.cump_labhistot_responsable;
        dto.cump_labhistot_fecha_limite ? cumplimiento.cump_labhistot_fecha_limite = dto.cump_labhistot_fecha_limite : cumplimiento.cump_labhistot_fecha_limite = cumplimiento.cump_labhistot_fecha_limite;
        
        await this.cumplimientoLabHistotecnRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
