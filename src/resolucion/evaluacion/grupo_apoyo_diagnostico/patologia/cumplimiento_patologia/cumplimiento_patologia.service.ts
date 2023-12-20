import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioPatologiaEntity } from '../criterio_patologia.entity';
import { CriterioPatologiaRepository } from '../criterio_patologia.repository';
import { CumplimientoPatologiaEntity } from '../cumplimiento_patologia.entity';
import { CumplimientoPatologiaRepository } from '../cumplimiento_patologia.repository';
import { CumplimientoPatologiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/patologia_dto/cumplimiento_patologia.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoPatologiaService {

    constructor(
        @InjectRepository(CumplimientoPatologiaEntity)
        private readonly cumplimientoPatologiaRepository: CumplimientoPatologiaRepository,
        @InjectRepository(CriterioPatologiaEntity)
        private readonly criterioPatologiaRepository: CriterioPatologiaRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_pato_id: number): Promise<CumplimientoPatologiaEntity> {
        const cumplimiento = await this.cumplimientoPatologiaRepository.findOne({ where: { cump_pato_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoPatologiaEntity[]> {
        const cumplimiento = await this.cumplimientoPatologiaRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_patologia.cripat_nombre_criterio','patologia.pato_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_patologia', 'criterio_patologia')
            .innerJoin('cumplimiento.cump_eva_patologia', 'cump_eva_patologia')
            .innerJoin('criterio_patologia.patologia', 'patologia')
            .where('cump_eva_patologia.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(cripat_id: number, eva_id: number, dto: CumplimientoPatologiaDto): Promise<any> {
        const criterio = await this.criterioPatologiaRepository.findOne({ where: { cripat_id: cripat_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoPatologiaRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_patologia = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_patologia = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoPatologiaRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CUMPLIMIENTO PATOLOGIA
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoPatologiaRepository.delete(cumplimiento.cump_pato_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO PATOLOGIA
    async updateCapacidad(id: number, dto: CumplimientoPatologiaDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_pato_cumple ? cumplimiento.cump_pato_cumple = dto.cump_pato_cumple : cumplimiento.cump_pato_cumple = cumplimiento.cump_pato_cumple;
        dto.cump_pato_hallazgo ? cumplimiento.cump_pato_hallazgo = dto.cump_pato_hallazgo : cumplimiento.cump_pato_hallazgo = cumplimiento.cump_pato_hallazgo;
        dto.cump_pato_accion ? cumplimiento.cump_pato_accion = dto.cump_pato_accion : cumplimiento.cump_pato_accion = cumplimiento.cump_pato_accion;
        dto.cump_pato_responsable ? cumplimiento.cump_pato_responsable = dto.cump_pato_responsable : cumplimiento.cump_pato_responsable = cumplimiento.cump_pato_responsable;
        dto.cump_pato_fecha_limite ? cumplimiento.cump_pato_fecha_limite = dto.cump_pato_fecha_limite : cumplimiento.cump_pato_fecha_limite = cumplimiento.cump_pato_fecha_limite;
        
        await this.cumplimientoPatologiaRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
