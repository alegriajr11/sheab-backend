import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioLabClinicoEntity } from '../criterio_lab_clinico.entity';
import { CriterioLabClinicoRepository } from '../criterio_lab_clinico.repository';
import { CumplimientoLabClinicoEntity } from '../cumplimiento_lab_clinico.entity';
import { CumplimientoLabClinicoRepository } from '../cumplimiento_lab_clinico.repository';
import { CumplimientoLabClinicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_clinico_dto/cumplimiento_lab_clinico.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoLabClinicoService {

    constructor(
        @InjectRepository(CumplimientoLabClinicoEntity)
        private readonly cumplimientoLabClinicoRepository: CumplimientoLabClinicoRepository,
        @InjectRepository(CriterioLabClinicoEntity)
        private readonly criterioLabClinicoRepository: CriterioLabClinicoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_labclin_id: number): Promise<CumplimientoLabClinicoEntity> {
        const cumplimiento = await this.cumplimientoLabClinicoRepository.findOne({ where: { cump_labclin_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoLabClinicoEntity[]> {
        const cumplimiento = await this.cumplimientoLabClinicoRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_lab_clinico.cri_lab_cli_nombre_criterio','lab_clinico.labclin_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_lab_clinico', 'criterio_lab_clinico')
            .innerJoin('cumplimiento.cump_eva_lab_clinico', 'cump_eva_lab_clinico')
            .innerJoin('criterio_lab_clinico.lab_clinico', 'lab_clinico')
            .where('cump_eva_lab_clinico.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(cri_lab_cli_id: number, eva_id: number, dto: CumplimientoLabClinicoDto): Promise<any> {
        const criterio = await this.criterioLabClinicoRepository.findOne({ where: { cri_lab_cli_id: cri_lab_cli_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoLabClinicoRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_lab_clinico = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_lab_clinico = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoLabClinicoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CUMPLIMIENTO LABORATORIO CLINICO
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoLabClinicoRepository.delete(cumplimiento.cump_labclin_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO LABORATORIO CLINICO
    async updateCapacidad(id: number, dto: CumplimientoLabClinicoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_labclin_cumple ? cumplimiento.cump_labclin_cumple = dto.cump_labclin_cumple : cumplimiento.cump_labclin_cumple = cumplimiento.cump_labclin_cumple;
        dto.cump_labclin_hallazgo ? cumplimiento.cump_labclin_hallazgo = dto.cump_labclin_hallazgo : cumplimiento.cump_labclin_hallazgo = cumplimiento.cump_labclin_hallazgo;
        dto.cump_labclin_accion ? cumplimiento.cump_labclin_accion = dto.cump_labclin_accion : cumplimiento.cump_labclin_accion = cumplimiento.cump_labclin_accion;
        dto.cump_labclin_responsable ? cumplimiento.cump_labclin_responsable = dto.cump_labclin_responsable : cumplimiento.cump_labclin_responsable = cumplimiento.cump_labclin_responsable;
        dto.cump_labclin_fecha_limite ? cumplimiento.cump_labclin_fecha_limite = dto.cump_labclin_fecha_limite : cumplimiento.cump_labclin_fecha_limite = cumplimiento.cump_labclin_fecha_limite;
        
        await this.cumplimientoLabClinicoRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
