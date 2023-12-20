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

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoDialisisEntity[]> {
        const cumplimiento = await this.cumplimientoDialisisRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_dialisis.cridial_nombre_criterio', 'dialisis.dial_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_dialisis', 'criterio_dialisis')
            .innerJoin('criterio_dialisis.dialisis', 'dialisis')
            .innerJoin('cumplimiento.cump_eva_dial', 'cump_eva_dial')
            .where('cump_eva_dial.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }


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



    //ELIMINAR CUMPLIMIENTO DIALISIS
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoDialisisRepository.delete(cumplimiento.cump_dial_id)
        return new MessageDto(`Cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO DIALISIS
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
