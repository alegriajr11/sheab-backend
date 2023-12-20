import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioLabUterinaEntity } from '../criterio_lab_citologia_uterina.entity';
import { CriterioLabUterinaRepository } from '../criterio_lab_citologia_uterina.repository';
import { CumplimientoLabUterinaEntity } from '../cumplimiento_lab_citologia_uterina.entity';
import { CumplimientoLabUterinaRepository } from '../cumplimiento_lab_citologia_uterina.repository';
import { CumplimientoLabUterinaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_citologias_uterinas_dto/cumplimiento_lab_citologia_uterina.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoLabCitologiaService {

    constructor(
        @InjectRepository(CumplimientoLabUterinaEntity)
        private readonly cumplimientoLabUterinaRepository: CumplimientoLabUterinaRepository,
        @InjectRepository(CriterioLabUterinaEntity)
        private readonly criterioLabUterinaRepository: CriterioLabUterinaRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_labuter_id: number): Promise<CumplimientoLabUterinaEntity> {
        const cumplimiento = await this.cumplimientoLabUterinaRepository.findOne({ where: { cump_labuter_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoLabUterinaEntity[]> {
        const cumplimiento = await this.cumplimientoLabUterinaRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_lab_uterina.cri_lab_ute_nombre_criterio', 'lab_cit_uterina.labcit_uter_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_lab_uterina', 'criterio_lab_uterina')
            .innerJoin('cumplimiento.cump_eva_cito_uter', 'cump_eva_cito_uter')
            .innerJoin('criterio_lab_uterina.lab_cit_uterina', 'lab_cit_uterina')
            .where('cump_eva_cito_uter.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(cri_lab_ute_id: number, eva_id: number, dto: CumplimientoLabUterinaDto): Promise<any> {
        const criterio = await this.criterioLabUterinaRepository.findOne({ where: { cri_lab_ute_id: cri_lab_ute_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoLabUterinaRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_lab_uterina = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_cito_uter = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoLabUterinaRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR CUMPLIMIENTO LAB CITOLOGIAS UTERINAS
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoLabUterinaRepository.delete(cumplimiento.cump_labuter_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO LAB CITOLOGIAS UTERINAS
    async updateCapacidad(id: number, dto: CumplimientoLabUterinaDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_labuter_cumple ? cumplimiento.cump_labuter_cumple = dto.cump_labuter_cumple : cumplimiento.cump_labuter_cumple = cumplimiento.cump_labuter_cumple;
        dto.cump_labuter_hallazgo ? cumplimiento.cump_labuter_hallazgo = dto.cump_labuter_hallazgo : cumplimiento.cump_labuter_hallazgo = cumplimiento.cump_labuter_hallazgo;
        dto.cump_labuter_accion ? cumplimiento.cump_labuter_accion = dto.cump_labuter_accion : cumplimiento.cump_labuter_accion = cumplimiento.cump_labuter_accion;
        dto.cump_labuter_responsable ? cumplimiento.cump_labuter_responsable = dto.cump_labuter_responsable : cumplimiento.cump_labuter_responsable = cumplimiento.cump_labuter_responsable;
        dto.cump_labuter_fecha_limite ? cumplimiento.cump_labuter_fecha_limite = dto.cump_labuter_fecha_limite : cumplimiento.cump_labuter_fecha_limite = cumplimiento.cump_labuter_fecha_limite;

        await this.cumplimientoLabUterinaRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
