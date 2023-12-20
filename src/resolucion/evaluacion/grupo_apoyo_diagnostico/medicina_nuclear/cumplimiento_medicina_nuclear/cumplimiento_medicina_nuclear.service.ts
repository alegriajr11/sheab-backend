import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioMedicinaNuclearEntity } from '../criterio_medicina_nuclear.entity';
import { CriterioMedicinaNuclearRepository } from '../criterio_medicina_nuclear.repository';
import { CumplimientoMedNuclearEntity } from '../cumplimineto_medicina_nuclear.entity';
import { CumplimientoMedNuclearRepository } from '../cumplimineto_medicina_nuclear.repository';
import { CumplimientoMedicinaNuclearDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/medicina_nuclear_dto/cumplimiento_medicina_nuclear.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoMedicinaNuclearService {

    constructor(
        @InjectRepository(CumplimientoMedNuclearEntity)
        private readonly cumplimientoMedNuclearRepository: CumplimientoMedNuclearRepository,
        @InjectRepository(CriterioMedicinaNuclearEntity)
        private readonly criterioMedicinaNuclearRepository: CriterioMedicinaNuclearRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_med_nucl_id: number): Promise<CumplimientoMedNuclearEntity> {
        const cumplimiento = await this.cumplimientoMedNuclearRepository.findOne({ where: { cump_med_nucl_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoMedNuclearEntity[]> {
        const cumplimiento = await this.cumplimientoMedNuclearRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_med_nuclear.crimed_nucl_nombre_criterio','med_nuclear.med_nucl_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_med_nuclear', 'criterio_med_nuclear')
            .innerJoin('cumplimiento.cump_eva_med_nuclear', 'cump_eva_med_nuclear')
            .innerJoin('criterio_med_nuclear.med_nuclear', 'med_nuclear')
            .where('cump_eva_med_nuclear.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(crimed_nucl_id: number, eva_id: number, dto: CumplimientoMedicinaNuclearDto): Promise<any> {
        const criterio = await this.criterioMedicinaNuclearRepository.findOne({ where: { crimed_nucl_id: crimed_nucl_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoMedNuclearRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_med_nuclear = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_med_nuclear = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoMedNuclearRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CUMPLIMIENTO MEDICINA NUCLEAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoMedNuclearRepository.delete(cumplimiento.cump_med_nucl_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO MEDICINA NUCLEAR
    async updateCapacidad(id: number, dto: CumplimientoMedicinaNuclearDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_med_nucl_cumple ? cumplimiento.cump_med_nucl_cumple = dto.cump_med_nucl_cumple : cumplimiento.cump_med_nucl_cumple = cumplimiento.cump_med_nucl_cumple;
        dto.cump_med_nucl_hallazgo ? cumplimiento.cump_med_nucl_hallazgo = dto.cump_med_nucl_hallazgo : cumplimiento.cump_med_nucl_hallazgo = cumplimiento.cump_med_nucl_hallazgo;
        dto.cump_med_nucl_accion ? cumplimiento.cump_med_nucl_accion = dto.cump_med_nucl_accion : cumplimiento.cump_med_nucl_accion = cumplimiento.cump_med_nucl_accion;
        dto.cump_med_nucl_responsable ? cumplimiento.cump_med_nucl_responsable = dto.cump_med_nucl_responsable : cumplimiento.cump_med_nucl_responsable = cumplimiento.cump_med_nucl_responsable;
        dto.cump_med_nucl_fecha_limite ? cumplimiento.cump_med_nucl_fecha_limite = dto.cump_med_nucl_fecha_limite : cumplimiento.cump_med_nucl_fecha_limite = cumplimiento.cump_med_nucl_fecha_limite;
        
        await this.cumplimientoMedNuclearRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
