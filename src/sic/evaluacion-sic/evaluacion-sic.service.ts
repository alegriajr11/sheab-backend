import { Injectable, NotFoundException } from '@nestjs/common';
import { EvaluacionSicEntity } from '../evaluacionsic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionsicRepository } from '../evaluacionsic.repository';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class EvaluacionSicService {

	constructor(
		@InjectRepository(EvaluacionSicEntity)
		private readonly evaluacionSicRepository: EvaluacionsicRepository,
	) { }

	//ENCONTRAR POR ID - FORANEA ACTA_ID
	async findByIdEvaSic(id_acta: number): Promise<EvaluacionSicEntity> {
		const evaluacion_sic = await this.evaluacionSicRepository.createQueryBuilder('evaluacion')
			.select(['evaluacion', 'eval_acta_sic.id', 'eval_acta_sic.act_id'])
			.innerJoin('evaluacion.eval_acta_sic', 'eval_acta_sic')
			.where('eval_acta_sic.id = :id_eva', { id_eva: id_acta })
			.getOne()
		if (!evaluacion_sic) {
			throw new NotFoundException(new MessageDto('La Evaluacion No Existe'));
		}
		return evaluacion_sic;
	}


	//ENCONTRAR EVALUACION POR ID
	async findById(eva_id: number): Promise<EvaluacionSicEntity> {
		const evaluacion_sic = await this.evaluacionSicRepository.findOne({ where: { eva_id } })
		if (!evaluacion_sic) {
			throw new NotFoundException(new MessageDto('No Existe la Evaluacion'));
		}
		return evaluacion_sic;
	}

	//LISTANDO LA ULTIMA EVALUACION REGISTRADA
	async getUltimaEvaluacion(): Promise<EvaluacionSicEntity> {
		const ultima_evaluacion = await this.evaluacionSicRepository.createQueryBuilder('evaluacion')
			.select(['evaluacion'])
			.orderBy('evaluacion.eva_id', 'DESC')
			.getOne();

		if (!ultima_evaluacion) throw new NotFoundException(new MessageDto('No existe evaluacion en la lista'))
		return ultima_evaluacion
	}
}
