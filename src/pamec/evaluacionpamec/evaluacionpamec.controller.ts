import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EvaluacionpamecService } from './evaluacionpamec.service';

@Controller('evaluacionpamec')
export class EvaluacionpamecController {

    constructor(
		private readonly evaluacionService: EvaluacionpamecService
	) { }

    //OBTENER EVALUACION POR ID ACTA
	@Get(':id')
	async getOneEvaluacion(@Param('id', ParseIntPipe) id: number) {
		return await this.evaluacionService.findByIdEvaInd(id);
	}

	//ULTIMA EVALUACION
	@Get()
	async ultimaEvaluacion() {
		return await this.evaluacionService.getUltimaEvaluacion()
	}

	@Get('/acta/:id')
	async getOneEvaActa(@Param('id', ParseIntPipe) id: number) {
		return await this.evaluacionService.getallEvaActa(id);
	}
}
