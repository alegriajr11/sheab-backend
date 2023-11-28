import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EvaluacionSicService } from './evaluacion-sic.service';

@Controller('evaluacion-sic')
export class EvaluacionSicController {

	constructor(
		private readonly evaluacionSicService: EvaluacionSicService
	) { }

	//OBTENER EVALUACION POR ID ACTA
	@Get(':id')
	async getOneEvaluacion(@Param('id', ParseIntPipe) id: number) {
		return await this.evaluacionSicService.findByIdEvaSic(id);
	}

	//ULTIMA EVALUACION
	@Get()
	async ultimaEvaluacion() {
		return await this.evaluacionSicService.getUltimaEvaluacion()
	}
}
