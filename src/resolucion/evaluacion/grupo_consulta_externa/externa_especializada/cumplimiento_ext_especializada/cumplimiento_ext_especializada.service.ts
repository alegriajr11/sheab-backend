import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioEspecializadaEntity } from '../criterio_especializada.entity';
import { CriterioEspecializadaRepository } from '../criterio_especializada.repository';
import { CumplimientoEspecializadaEntity } from '../cumplimiento_especializada.entity';
import { CumplimientoEspecializadaRepository } from '../cumplimiento_especializada.repository';
import { CumplimientoEspecializadaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/externa_especializada_dto/cumplimiento_especializada.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoExtEspecializadaService {

    constructor(
        @InjectRepository(CumplimientoEspecializadaEntity)
        private readonly cumplimientoEspecializadaRepository: CumplimientoEspecializadaRepository,
        @InjectRepository(CriterioEspecializadaEntity)
        private readonly criterioEspecializadaRepository: CriterioEspecializadaRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_exte_id: number): Promise<CumplimientoEspecializadaEntity> {
        const cumplimiento = await this.cumplimientoEspecializadaRepository.findOne({ where: { cump_exte_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoEspecializadaEntity[]> {
        const cumplimiento = await this.cumplimientoEspecializadaRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_externa_especializada.criexte_nombre_criterio', 'externa_especializada.exte_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_externa_especializada', 'criterio_externa_especializada')
            .innerJoin('cumplimiento.cump_eva_espe', 'cump_eva_espe')
            .innerJoin('criterio_externa_especializada.externa_especializada', 'externa_especializada')
            .where('cump_eva_espe.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(criextg_id: number, eva_id: number, dto: CumplimientoEspecializadaDto): Promise<any> {
        const criterio = await this.criterioEspecializadaRepository.findOne({ where: { criextg_id: criextg_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoEspecializadaRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_externa_especializada = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_espe = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoEspecializadaRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR CUMPLIMIENTO CONSULTA EXTERNA ESPECIALIZADA
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoEspecializadaRepository.delete(cumplimiento.cump_exte_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO CONSULTA EXTERNA ESPECIALIZADA
    async updateCapacidad(id: number, dto: CumplimientoEspecializadaDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_exte_cumple ? cumplimiento.cump_exte_cumple = dto.cump_exte_cumple : cumplimiento.cump_exte_cumple = cumplimiento.cump_exte_cumple;
        dto.cump_exte_hallazgo ? cumplimiento.cump_exte_hallazgo = dto.cump_exte_hallazgo : cumplimiento.cump_exte_hallazgo = cumplimiento.cump_exte_hallazgo;
        dto.cump_exte_accion ? cumplimiento.cump_exte_accion = dto.cump_exte_accion : cumplimiento.cump_exte_accion = cumplimiento.cump_exte_accion;
        dto.cump_exte_responsable ? cumplimiento.cump_exte_responsable = dto.cump_exte_responsable : cumplimiento.cump_exte_responsable = cumplimiento.cump_exte_responsable;
        dto.cump_exte_fecha_limite ? cumplimiento.cump_exte_fecha_limite = dto.cump_exte_fecha_limite : cumplimiento.cump_exte_fecha_limite = cumplimiento.cump_exte_fecha_limite;

        await this.cumplimientoEspecializadaRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
