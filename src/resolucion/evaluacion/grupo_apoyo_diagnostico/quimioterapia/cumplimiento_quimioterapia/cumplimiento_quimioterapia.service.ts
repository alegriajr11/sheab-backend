import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioQuimioterapiaEntity } from '../criterio_quimioterapia.entity';
import { CriterioQuimioterapiaRepository } from '../criterio_quimioterapia.repository';
import { CumplimientoQuimioterapiaEntity } from '../cumplimiento_quimioterapia.entity';
import { CumplimientoQuimioterapiaRepository } from '../cumplimiento_quimioterapia.repository';
import { CumplimientoQuimioterapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/quimioterapia_dto/cumplimiento_quimioterapia.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoQuimioterapiaService {

    constructor(
        @InjectRepository(CumplimientoQuimioterapiaEntity)
        private readonly cumplimientoQuimioterapiaRepository: CumplimientoQuimioterapiaRepository,
        @InjectRepository(CriterioQuimioterapiaEntity)
        private readonly criterioQuimioterapiaRepository: CriterioQuimioterapiaRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_quim_id: number): Promise<CumplimientoQuimioterapiaEntity> {
        const cumplimiento = await this.cumplimientoQuimioterapiaRepository.findOne({ where: { cump_quim_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoQuimioterapiaEntity[]> {
        const cumplimiento = await this.cumplimientoQuimioterapiaRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_quimioterapia.criquim_nombre_criterio', 'quimioterapia.quim_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_quimioterapia', 'criterio_quimioterapia')
            .innerJoin('cumplimiento.cump_eva_quimio', 'cump_eva_quimio')
            .innerJoin('criterio_quimioterapia.quimioterapia', 'quimioterapia')
            .where('cump_eva_quimio.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(criquim_id: number, eva_id: number, dto: CumplimientoQuimioterapiaDto): Promise<any> {
        const criterio = await this.criterioQuimioterapiaRepository.findOne({ where: { criquim_id: criquim_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoQuimioterapiaRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_quimioterapia = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_quimio = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoQuimioterapiaRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR CUMPLIMIENTO QUIMIOTERAPIA
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoQuimioterapiaRepository.delete(cumplimiento.cump_quim_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO QUIMIOTERAPIA
    async updateCapacidad(id: number, dto: CumplimientoQuimioterapiaDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_quim_cumple ? cumplimiento.cump_quim_cumple = dto.cump_quim_cumple : cumplimiento.cump_quim_cumple = cumplimiento.cump_quim_cumple;
        dto.cump_quim_hallazgo ? cumplimiento.cump_quim_hallazgo = dto.cump_quim_hallazgo : cumplimiento.cump_quim_hallazgo = cumplimiento.cump_quim_hallazgo;
        dto.cump_quim_accion ? cumplimiento.cump_quim_accion = dto.cump_quim_accion : cumplimiento.cump_quim_accion = cumplimiento.cump_quim_accion;
        dto.cump_quim_responsable ? cumplimiento.cump_quim_responsable = dto.cump_quim_responsable : cumplimiento.cump_quim_responsable = cumplimiento.cump_quim_responsable;
        dto.cump_quim_fecha_limite ? cumplimiento.cump_quim_fecha_limite = dto.cump_quim_fecha_limite : cumplimiento.cump_quim_fecha_limite = cumplimiento.cump_quim_fecha_limite;

        await this.cumplimientoQuimioterapiaRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
