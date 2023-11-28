import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { EvaluacionipsEntity } from '../evaluacionips.entity';
import { EvaluacionIpsRepository } from '../evaluacionips.repository';
import { ActaSpIpsEntity } from 'src/generarpdf/sp/sp-ips/sp-ips.entity';
import { ActaSpIpsRepository } from 'src/generarpdf/sp/sp-ips/sp-ips.repository';

@Injectable()
export class EvaluacionipsService {

    constructor(
        @InjectRepository(EvaluacionipsEntity)
        private readonly evaluacionipsRepository: EvaluacionIpsRepository,
        @InjectRepository(ActaSpIpsEntity)
        private readonly actaSpIpsRepository: ActaSpIpsRepository,
    ) { }

    //LISTAR UNA EVALUACIÓN POR SU ID
    async findById(evips_id: number): Promise<EvaluacionipsEntity> {
        const evaluacionips = await this.evaluacionipsRepository.findOne({ where: { evips_id } });
        if (!evaluacionips) {
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return evaluacionips;
    }

    //LISTAR TODAS LAS EVALUACIONES EXISTENTES
    async getall(): Promise<EvaluacionipsEntity[]> {
        const dom = await this.evaluacionipsRepository.find()
        if (!dom) throw new NotFoundException(new MessageDto('No hay Evaluaciones en la lista'))
        return dom;
    }


    //LISTAR EVALUACIONES POR ID DEL ACTA
    async getallactaseva(id_acta: number): Promise<EvaluacionipsEntity[]> {
        const evalucion = await this.evaluacionipsRepository.createQueryBuilder('evaluacion')
            .select(['evaluacion', 'actas_ips.id'])
            .innerJoin('evaluacion.actas_ips', 'actas_ips')
            .where('actas_ips.id = :acta_id', { acta_id: id_acta })
            .getMany()
        if (evalucion.length === 0) throw new NotFoundException(new MessageDto('No hay Evaluaciones Realiazadas IPS en la lista'))
        return evalucion;
    }
}
