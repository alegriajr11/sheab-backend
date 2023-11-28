import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EvaluacionIndService } from './evaluacion-ind.service';

@Controller('evaluacion-ind')
export class EvaluacionIndController {

    constructor(
		private readonly evaluacionIndService: EvaluacionIndService
	) { }

    //OBTENER EVALUACION POR ID ACTA
	@Get(':id')
	async getOneEvaluacion(@Param('id', ParseIntPipe) id: number) {
		return await this.evaluacionIndService.findByIdEvaInd(id);
	}

	//ULTIMA EVALUACION
	@Get()
	async ultimaEvaluacion() {
		return await this.evaluacionIndService.getUltimaEvaluacion()
	}

	@Get('/acta/:id')
	async getOneEvaActa(@Param('id', ParseIntPipe) id: number) {
		return await this.evaluacionIndService.getallEvaActa(id);
	}
}
