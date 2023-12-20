import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioCuidBasNeonatalEntity } from '../criterio_cuid_basic_neonatal.entity';
import { CriterioCuidBasNeonatalRepository } from '../criterio_cuid_basic_neonatal.repository';
import { CumplimientoCuidBasNeonatalEntity } from '../cumplimiento_cuid_basic_neonatal.entity';
import { CumplimientoCuidBasNeonatalRepository } from '../cumplimiento_cuid_basic_neonatal.repository';
import { CumplimientoCuidBasNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_basico_neonatal_dto/cumplimiento_cuid_basic_neonatal.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoCuidBasicNeonatalService {

    constructor(
        @InjectRepository(CumplimientoCuidBasNeonatalEntity)
        private readonly cumplimientoCuidBasNeonatalRepository: CumplimientoCuidBasNeonatalRepository,
        @InjectRepository(CriterioCuidBasNeonatalEntity)
        private readonly criterioCuidBasNeonatalRepository: CriterioCuidBasNeonatalRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_cui_neona_id: number): Promise<CumplimientoCuidBasNeonatalEntity> {
        const cumplimiento = await this.cumplimientoCuidBasNeonatalRepository.findOne({ where: { cump_cui_neona_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoCuidBasNeonatalEntity[]> {
        const cumplimiento = await this.cumplimientoCuidBasNeonatalRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_cuid_bas_neonatal.cri_neona_nombre_criterio', 'cuid_bas_neonatal.cuid_neona_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_cuid_bas_neonatal', 'criterio_cuid_bas_neonatal')
            .innerJoin('cumplimiento.cump_eva_bas_neo', 'cump_eva_bas_neo')
            .innerJoin('criterio_cuid_bas_neonatal.cuid_bas_neonatal', 'cuid_bas_neonatal')
            .where('cump_eva_bas_neo.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(cri_neona_id: number, eva_id: number, dto: CumplimientoCuidBasNeonatalDto): Promise<any> {
        const criterio = await this.criterioCuidBasNeonatalRepository.findOne({ where: { cri_neona_id: cri_neona_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoCuidBasNeonatalRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_cuid_bas_neonatal = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_bas_neo = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoCuidBasNeonatalRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR CUIDADO BASICO NEONATAL
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoCuidBasNeonatalRepository.delete(cumplimiento.cump_cui_neona_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUIDADO BASICO NEONATAL
    async updateCapacidad(id: number, dto: CumplimientoCuidBasNeonatalDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_cui_neona_cumple ? cumplimiento.cump_cui_neona_cumple = dto.cump_cui_neona_cumple : cumplimiento.cump_cui_neona_cumple = cumplimiento.cump_cui_neona_cumple;
        dto.cump_cui_neona_hallazgo ? cumplimiento.cump_cui_neona_hallazgo = dto.cump_cui_neona_hallazgo : cumplimiento.cump_cui_neona_hallazgo = cumplimiento.cump_cui_neona_hallazgo;
        dto.cump_cui_neona_accion ? cumplimiento.cump_cui_neona_accion = dto.cump_cui_neona_accion : cumplimiento.cump_cui_neona_accion = cumplimiento.cump_cui_neona_accion;
        dto.cump_cui_neona_responsable ? cumplimiento.cump_cui_neona_responsable = dto.cump_cui_neona_responsable : cumplimiento.cump_cui_neona_responsable = cumplimiento.cump_cui_neona_responsable;
        dto.cump_cui_neona_fecha_limite ? cumplimiento.cump_cui_neona_fecha_limite = dto.cump_cui_neona_fecha_limite : cumplimiento.cump_cui_neona_fecha_limite = cumplimiento.cump_cui_neona_fecha_limite;

        await this.cumplimientoCuidBasNeonatalRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
