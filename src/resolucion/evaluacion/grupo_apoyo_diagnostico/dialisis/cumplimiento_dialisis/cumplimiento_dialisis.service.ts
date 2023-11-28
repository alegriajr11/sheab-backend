import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CumplimientoDialisisEntity } from '../cumplimiento_dialisis.entity';
import { CriterioDialisisRepository } from '../criterio_dialisis.repository';
import { CumplimientoDialisisRepository } from '../cumplimiento_dialisis.repository';
import { CriterioDialisisEntity } from '../criterio_dialisis.entity';
import { MessageDto } from 'src/common/message.dto';
import { CumplimientoDialisisDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/dialisis_dto/cumplimiento_dialisis.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoDialisisService {
    constructor(
        @InjectRepository(CumplimientoDialisisEntity)
        private readonly cumplimientoDialisisRepository: CumplimientoDialisisRepository,
        @InjectRepository(CriterioDialisisEntity)
        private readonly criterioDialisisRepository: CriterioDialisisRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_dial_id: number): Promise<CumplimientoDialisisEntity> {
        const cumplimiento = await this.cumplimientoDialisisRepository.findOne({ where: { cump_dial_id } });
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
    async create(cridial_id: number, eva_id: number, dto: CumplimientoDialisisDto): Promise<any> {
        const criterio = await this.criterioDialisisRepository.findOne({ where: { cridial_id: cridial_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La Evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoDialisisRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_dialisis = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_dial = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoDialisisRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoDialisisRepository.delete(cumplimiento.cump_dial_id)
        return new MessageDto(`Cumplimiento Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoDialisisDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_dial_cumple ? cumplimiento.cump_dial_cumple = dto.cump_dial_cumple : cumplimiento.cump_dial_cumple = cumplimiento.cump_dial_cumple;
        dto.cump_dial_hallazgo ? cumplimiento.cump_dial_hallazgo = dto.cump_dial_hallazgo : cumplimiento.cump_dial_hallazgo = cumplimiento.cump_dial_hallazgo;
        dto.cump_dial_accion ? cumplimiento.cump_dial_accion = dto.cump_dial_accion : cumplimiento.cump_dial_accion = cumplimiento.cump_dial_accion;
        dto.cump_dial_responsable ? cumplimiento.cump_dial_responsable = dto.cump_dial_responsable : cumplimiento.cump_dial_responsable = cumplimiento.cump_dial_responsable;
        dto.cump_dial_fecha_limite ? cumplimiento.cump_dial_fecha_limite = dto.cump_dial_fecha_limite : cumplimiento.cump_dial_fecha_limite = cumplimiento.cump_dial_fecha_limite;
        
        await this.cumplimientoDialisisRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    }
    
}
