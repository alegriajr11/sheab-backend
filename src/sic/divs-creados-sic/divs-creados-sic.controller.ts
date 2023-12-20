import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DivsCreadosSicService } from './divs-creados-sic.service';
import { DivCreadoSicDto } from 'src/usuario/dto/Sic/divCreados.dto';

@Controller('divs-creados-sic')
export class DivsCreadosSicController {

    constructor(
        private readonly div_creadoSicService: DivsCreadosSicService
    ) { }

    //OBTENER LOS DIVS CREADOS POR ID DE EVALUACION
    @Get(':eva_id')
    async getDivsByEvaluacion(@Param('eva_id') eva_id: number){
        return this.div_creadoSicService.getDivsByEvaluacion(eva_id)
    }

    //CREAR DIVS PARA LA EVALUACION ASIGNADA
    @Post()
    async create(@Body() payload: { dto: DivCreadoSicDto }) {
        const { dto } = payload;
        return this.div_creadoSicService.createDiv(payload);
    }
}
