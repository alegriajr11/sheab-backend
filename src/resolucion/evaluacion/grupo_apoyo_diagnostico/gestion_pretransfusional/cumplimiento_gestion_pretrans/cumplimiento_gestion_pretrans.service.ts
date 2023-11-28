import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MessageDto } from 'src/common/message.dto';
import { CriterioGestionPretransfusionalEntity } from '../criterio_gestion_pretrans.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CumplimientoGestionPretransfusionalEntity } from '../cumplimiento_gestion_pretrans.entity';
import { CriterioGestionPretransfusionalRepository } from '../criterio_gestion_pretrans.repository';
import { CumplimientoGestionPretransfusionalRepository } from '../cumplimiento_gestion_pretrans.repository';
import { CumplimientoGestionPretransfusionalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/gestion_pretransfusional_dto/cumplimiento_gestion_pretrans.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoGestionPretransService {

    constructor(
        @InjectRepository(CumplimientoGestionPretransfusionalEntity)
        private readonly cumplimientoGestionPretransfusionalRepository: CumplimientoGestionPretransfusionalRepository,
        @InjectRepository(CriterioGestionPretransfusionalEntity)
        private readonly criterioGestionPretransfusionalRepository: CriterioGestionPretransfusionalRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_gestpre_id: number): Promise<CumplimientoGestionPretransfusionalEntity> {
        const cumplimiento = await this.cumplimientoGestionPretransfusionalRepository.findOne({ where: { cump_gestpre_id } });
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
    async create(crigestpre_id: number, eva_id: number, dto: CumplimientoGestionPretransfusionalDto): Promise<any> {
        const criterio = await this.criterioGestionPretransfusionalRepository.findOne({ where: { crigestpre_id: crigestpre_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoGestionPretransfusionalRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_gest_pretransfusional = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_pretrans = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoGestionPretransfusionalRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoGestionPretransfusionalRepository.delete(cumplimiento.cump_gestpre_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoGestionPretransfusionalDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_gestpre_cumple ? cumplimiento.cump_gestpre_cumple = dto.cump_gestpre_cumple : cumplimiento.cump_gestpre_cumple = cumplimiento.cump_gestpre_cumple;
        dto.cump_gestpre_hallazgo ? cumplimiento.cump_gestpre_hallazgo = dto.cump_gestpre_hallazgo : cumplimiento.cump_gestpre_hallazgo = cumplimiento.cump_gestpre_hallazgo;
        dto.cump_gestpre_accion ? cumplimiento.cump_gestpre_accion = dto.cump_gestpre_accion : cumplimiento.cump_gestpre_accion = cumplimiento.cump_gestpre_accion;
        dto.cump_gestpre_responsable ? cumplimiento.cump_gestpre_responsable = dto.cump_gestpre_responsable : cumplimiento.cump_gestpre_responsable = cumplimiento.cump_gestpre_responsable;
        dto.cump_gestpre_fecha_limite ? cumplimiento.cump_gestpre_fecha_limite = dto.cump_gestpre_fecha_limite : cumplimiento.cump_gestpre_fecha_limite = cumplimiento.cump_gestpre_fecha_limite;
        
        await this.cumplimientoGestionPretransfusionalRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
