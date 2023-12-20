import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidInteNeonatalEntity } from '../criterio_cuid_intens_neonatal.entity';
import { CriterioCuidInteNeonatalRepository } from '../criterio_cuid_intens_neonatal.repository';
import { CumplimientoCuidIntNeonatalEntity } from '../cumplimiento_cuid_intens_neonatal.entity';
import { CumplimientoCuidIntNeonatalRepository } from '../cumplimiento_cuid_intens_neonatal.repository';
import { CumplimientoCuidInteNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_neonatal_dto/cumplimiento_cuid_intens_neonatal.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoCuidIntensNeonatalService {

    constructor(
        @InjectRepository(CumplimientoCuidIntNeonatalEntity)
        private readonly cumplimientoCuidIntNeonatalRepository: CumplimientoCuidIntNeonatalRepository,
        @InjectRepository(CriterioCuidInteNeonatalEntity)
        private readonly criterioCuidInteNeonatalRepository: CriterioCuidInteNeonatalRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_int_neon_id: number): Promise<CumplimientoCuidIntNeonatalEntity> {
        const cumplimiento = await this.cumplimientoCuidIntNeonatalRepository.findOne({ where: { cump_int_neon_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoCuidIntNeonatalEntity[]> {
        const cumplimiento = await this.cumplimientoCuidIntNeonatalRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_cuid_int_neonatal.cri_neona_nombre_criterio', 'cuid_int_neonatal.cuid_int_neona_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_cuid_int_neonatal', 'criterio_cuid_int_neonatal')
            .innerJoin('cumplimiento.cump_eva_intens_neo', 'cump_eva_intens_neo')
            .innerJoin('criterio_cuid_int_neonatal.cuid_int_neonatal', 'cuid_int_neonatal')
            .where('cump_eva_intens_neo.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(cri_neona_id: number, eva_id: number, dto: CumplimientoCuidInteNeonatalDto): Promise<any> {
        const criterio = await this.criterioCuidInteNeonatalRepository.findOne({ where: { cri_neona_id: cri_neona_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoCuidIntNeonatalRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cuid_int_neonatal = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_intens_neo = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoCuidIntNeonatalRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR CUIDADO INTENSIVO NEONATAL
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoCuidIntNeonatalRepository.delete(cumplimiento.cump_int_neon_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUIDADO INTENSIVO NEONATAL
    async updateCapacidad(id: number, dto: CumplimientoCuidInteNeonatalDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_int_neon_cumple ? cumplimiento.cump_int_neon_cumple = dto.cump_int_neon_cumple : cumplimiento.cump_int_neon_cumple = cumplimiento.cump_int_neon_cumple;
        dto.cump_int_neon_hallazgo ? cumplimiento.cump_int_neon_hallazgo = dto.cump_int_neon_hallazgo : cumplimiento.cump_int_neon_hallazgo = cumplimiento.cump_int_neon_hallazgo;
        dto.cump_int_neon_accion ? cumplimiento.cump_int_neon_accion = dto.cump_int_neon_accion : cumplimiento.cump_int_neon_accion = cumplimiento.cump_int_neon_accion;
        dto.cump_int_neon_responsable ? cumplimiento.cump_int_neon_responsable = dto.cump_int_neon_responsable : cumplimiento.cump_int_neon_responsable = cumplimiento.cump_int_neon_responsable;
        dto.cump_int_neon_fecha_limite ? cumplimiento.cump_int_neon_fecha_limite = dto.cump_int_neon_fecha_limite : cumplimiento.cump_int_neon_fecha_limite = cumplimiento.cump_int_neon_fecha_limite;

        await this.cumplimientoCuidIntNeonatalRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
