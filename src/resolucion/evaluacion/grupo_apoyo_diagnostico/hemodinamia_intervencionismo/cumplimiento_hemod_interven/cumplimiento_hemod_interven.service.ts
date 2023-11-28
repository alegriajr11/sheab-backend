import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CumplimientoHermoIntervenEntity } from '../cumplimiento_hemo_inter.entity';
import { CumplimientoHermoIntervenRepository } from '../cumplimiento_hemo_inter.repository';
import { CriterioHermoIntervenEntity } from '../criterio_hemo_inter.entity';
import { CriterioHermoIntervenRepository } from '../criterio_hemo_inter.repository';
import { CumplimientoHermodinamiaIntervenDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/hemodinamia_intervencionismo_dto/cumplimiento_hemo_inter.dto.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoHemodIntervenService {

    constructor(
        @InjectRepository(CumplimientoHermoIntervenEntity)
        private readonly cumplimientoHermoIntervenRepository: CumplimientoHermoIntervenRepository,
        @InjectRepository(CriterioHermoIntervenEntity)
        private readonly criterioHermoIntervenRepository: CriterioHermoIntervenRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_herminter_id: number): Promise<CumplimientoHermoIntervenEntity> {
        const cumplimiento = await this.cumplimientoHermoIntervenRepository.findOne({ where: { cump_herminter_id } });
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
    async create(criherminte_id: number, eva_id: number, dto: CumplimientoHermodinamiaIntervenDto): Promise<any> {
        const criterio = await this.criterioHermoIntervenRepository.findOne({ where: { criherminte_id: criherminte_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoHermoIntervenRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_hermo_interven = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_hemo_inter = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoHermoIntervenRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoHermoIntervenRepository.delete(cumplimiento.cump_herminter_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoHermodinamiaIntervenDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_herminter_cumple ? cumplimiento.cump_herminter_cumple = dto.cump_herminter_cumple : cumplimiento.cump_herminter_cumple = cumplimiento.cump_herminter_cumple;
        dto.cump_herminter_hallazgo ? cumplimiento.cump_herminter_hallazgo = dto.cump_herminter_hallazgo : cumplimiento.cump_herminter_hallazgo = cumplimiento.cump_herminter_hallazgo;
        dto.cump_herminter_accion ? cumplimiento.cump_herminter_accion = dto.cump_herminter_accion : cumplimiento.cump_herminter_accion = cumplimiento.cump_herminter_accion;
        dto.cump_herminter_responsable ? cumplimiento.cump_herminter_responsable = dto.cump_herminter_responsable : cumplimiento.cump_herminter_responsable = cumplimiento.cump_herminter_responsable;
        dto.cump_herminter_fecha_limite ? cumplimiento.cump_herminter_fecha_limite = dto.cump_herminter_fecha_limite : cumplimiento.cump_herminter_fecha_limite = cumplimiento.cump_herminter_fecha_limite;
        
        await this.cumplimientoHermoIntervenRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
