import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioUrgenciasEntity } from '../criterio_urgencias.entity';
import { CriterioUrgenciasRepository } from '../criterio_urgencias.repository';
import { CumplimientoUrgenciasEntity } from '../cumplimiento_urgencias.entity';
import { CumplimientoUrgenciasRepository } from '../cumplimiento_urgencias.repository';
import { CumplimientoUrgenciasDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/urgencias_dto/cumplimiento_urgencias.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoUrgenciasService {


    constructor(
        @InjectRepository(CriterioUrgenciasEntity)
        private readonly criterioUrgenciasRepository: CriterioUrgenciasRepository,
        @InjectRepository(CumplimientoUrgenciasEntity)
        private readonly cumplimientoUrgenciasRepository: CumplimientoUrgenciasRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_urge_id: number): Promise<CumplimientoUrgenciasEntity> {
        const cumplimiento = await this.cumplimientoUrgenciasRepository.findOne({ where: { cump_urge_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoUrgenciasEntity[]> {
        const cumplimiento = await this.cumplimientoUrgenciasRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_urgencias.criurge_nombre_criterio', 'urgencias.urg_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_urgencias', 'criterio_urgencias')
            .innerJoin('cumplimiento.cump_eva_urgencias', 'cump_eva_urgencias')
            .innerJoin('criterio_urgencias.urgencias', 'urgencias')
            .where('cump_eva_urgencias.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(criurge_id: number, eva_id: number, dto: CumplimientoUrgenciasDto): Promise<any> {
        const criterio = await this.criterioUrgenciasRepository.findOne({ where: { criurge_id: criurge_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoUrgenciasRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_urgencias = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_urgencias = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoUrgenciasRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR CUMPLIMIENTO URGENCIAS
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoUrgenciasRepository.delete(cumplimiento.cump_urge_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO URGENCIAS
    async updateCapacidad(id: number, dto: CumplimientoUrgenciasDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_urge_cumple ? cumplimiento.cump_urge_cumple = dto.cump_urge_cumple : cumplimiento.cump_urge_cumple = cumplimiento.cump_urge_cumple;
        dto.cump_urge_hallazgo ? cumplimiento.cump_urge_hallazgo = dto.cump_urge_hallazgo : cumplimiento.cump_urge_hallazgo = cumplimiento.cump_urge_hallazgo;
        dto.cump_urge_accion ? cumplimiento.cump_urge_accion = dto.cump_urge_accion : cumplimiento.cump_urge_accion = cumplimiento.cump_urge_accion;
        dto.cump_urge_responsable ? cumplimiento.cump_urge_responsable = dto.cump_urge_responsable : cumplimiento.cump_urge_responsable = cumplimiento.cump_urge_responsable;
        dto.cump_urge_fecha_limite ? cumplimiento.cump_urge_fecha_limite = dto.cump_urge_fecha_limite : cumplimiento.cump_urge_fecha_limite = cumplimiento.cump_urge_fecha_limite;

        await this.cumplimientoUrgenciasRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
