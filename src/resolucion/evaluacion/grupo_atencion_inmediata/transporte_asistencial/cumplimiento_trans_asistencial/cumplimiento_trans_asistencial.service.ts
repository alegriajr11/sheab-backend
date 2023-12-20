import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioTranspAsistencialEntity } from '../criterio_trans_asistencial.entity';
import { CriterioTranspAsistencialRepository } from '../criterio_trans_asistencial.repository';
import { CumplimientoTranspAsistencialEntity } from '../cumplimiento_trans_asistencial.entity';
import { CumplimientoTranspAsistencialRepository } from '../cumplimiento_trans_asistencial.repository';
import { CumplimientoTranspAsistencialDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/transporte_asistencial_dto/cumplimiento_trans_asistencial.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoTransAsistencialService {

    constructor(
        @InjectRepository(CumplimientoTranspAsistencialEntity)
        private readonly cumplimientoTranspAsistencialRepository: CumplimientoTranspAsistencialRepository,
        @InjectRepository(CriterioTranspAsistencialEntity)
        private readonly criterioTranspAsistencialRepository: CriterioTranspAsistencialRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_trans_asis_id: number): Promise<CumplimientoTranspAsistencialEntity> {
        const cumplimiento = await this.cumplimientoTranspAsistencialRepository.findOne({ where: { cump_trans_asis_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoTranspAsistencialEntity[]> {
        const cumplimiento = await this.cumplimientoTranspAsistencialRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_transp_asistencial.cri_trans_asis_nombre_criterio', 'transp_asistencial.trans_asis_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_transp_asistencial', 'criterio_transp_asistencial')
            .innerJoin('cumplimiento.cump_eva_trans_asist', 'cump_eva_trans_asist')
            .innerJoin('criterio_transp_asistencial.transp_asistencial', 'transp_asistencial')
            .where('cump_eva_trans_asist.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(cri_trans_asis_id: number, eva_id: number, dto: CumplimientoTranspAsistencialDto): Promise<any> {
        const criterio = await this.criterioTranspAsistencialRepository.findOne({ where: { cri_trans_asis_id: cri_trans_asis_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoTranspAsistencialRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_transp_asistencial = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_trans_asist = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoTranspAsistencialRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR CUMPLIMIENTOS TRASNPORTE ASISTENCIAL
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoTranspAsistencialRepository.delete(cumplimiento.cump_trans_asis_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTOS TRASNPORTE ASISTENCIAL
    async updateCapacidad(id: number, dto: CumplimientoTranspAsistencialDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_trans_asis_cumple ? cumplimiento.cump_trans_asis_cumple = dto.cump_trans_asis_cumple : cumplimiento.cump_trans_asis_cumple = cumplimiento.cump_trans_asis_cumple;
        dto.cump_trans_asis_hallazgo ? cumplimiento.cump_trans_asis_hallazgo = dto.cump_trans_asis_hallazgo : cumplimiento.cump_trans_asis_hallazgo = cumplimiento.cump_trans_asis_hallazgo;
        dto.cump_trans_asis_accion ? cumplimiento.cump_trans_asis_accion = dto.cump_trans_asis_accion : cumplimiento.cump_trans_asis_accion = cumplimiento.cump_trans_asis_accion;
        dto.cump_trans_asis_responsable ? cumplimiento.cump_trans_asis_responsable = dto.cump_trans_asis_responsable : cumplimiento.cump_trans_asis_responsable = cumplimiento.cump_trans_asis_responsable;
        dto.cump_trans_asis_fecha_limite ? cumplimiento.cump_trans_asis_fecha_limite = dto.cump_trans_asis_fecha_limite : cumplimiento.cump_trans_asis_fecha_limite = cumplimiento.cump_trans_asis_fecha_limite;

        await this.cumplimientoTranspAsistencialRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
