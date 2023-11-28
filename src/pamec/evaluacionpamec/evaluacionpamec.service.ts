import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionPamecEntity } from '../evaluacion-pamec.entity';
import { EvaluacionPamecRepository } from '../evaluacion-pamec.repository';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class EvaluacionpamecService {

    constructor(
        @InjectRepository(EvaluacionPamecEntity)
        private readonly evaluacionPamecRepository: EvaluacionPamecRepository
    ) { }

    //ENCONTRAR POR ID - FORANEA ACTA_ID
    async findByIdEvaInd(id_acta: number): Promise<EvaluacionPamecEntity> {
        const evaluacion_ind = await this.evaluacionPamecRepository.createQueryBuilder('evaluacion')
            .select(['evaluacion'])
            .innerJoinAndSelect('evaluacion.eval_acta_pamec', 'eval_acta_pamec')
            .where('eval_acta_pamec.id = :id_eva', { id_eva: id_acta })
            .getOne()
        if (!evaluacion_ind) {
            throw new NotFoundException(new MessageDto('La Evaluación No Existe'));
        }
        return evaluacion_ind;
    }

    //ENCONTRAR EVALUACION POR ID
    async findById(eva_id: number): Promise<EvaluacionPamecEntity> {
        const evaluacion_ind = await this.evaluacionPamecRepository.findOne({ where: { eva_id } })
        if (!evaluacion_ind) {
            throw new NotFoundException(new MessageDto('No Existe la Evaluacion'));
        }
        return evaluacion_ind;
    }

    //LISTANDO LA ULTIMA EVALUACION REGISTRADA
    async getUltimaEvaluacion(): Promise<EvaluacionPamecEntity> {
        const ultima_evaluacion = await this.evaluacionPamecRepository.createQueryBuilder('evaluacion')
            .select(['evaluacion'])
            .orderBy('evaluacion.eva_id', 'DESC')
            .getOne();

        if (!ultima_evaluacion) throw new NotFoundException(new MessageDto('No existe evaluación en la lista'))
        return ultima_evaluacion
    }

    //criterio por acta
    async getallEvaActa(eva_id: number): Promise<EvaluacionPamecEntity[]> {

        const criterio = await this.evaluacionPamecRepository.createQueryBuilder('evaluacion')
            .select(['evaluacion', 'eval_acta_pamec.act_nombre_prestador', 'eval_acta_pamec.act_nombre_funcionario',
                'eval_acta_pamec.act_cargo_funcionario', 'eval_acta_pamec.act_nombre_prestador'])
            .innerJoinAndSelect('evaluacion.eval_acta_pamec', 'eval_acta_pamec')
            .where('evaluacion.eva_id = :id_eva', { id_eva: eva_id })
            .getMany()

        return criterio
    }
}
