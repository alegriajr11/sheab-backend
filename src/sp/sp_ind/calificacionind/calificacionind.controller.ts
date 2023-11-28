import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CalificacionindService } from './calificacionind.service';
import { CalificacionindDto } from '../dto/calificacionind.dto';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('calificacionind')
export class CalificacionindController {

    constructor(private readonly calificacionindService: CalificacionindService) {
    }

    //CREAR CALIFICACION
    @Post()
    async create(@Body() payload: { dto: CalificacionindDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        console.log(dto)
        return this.calificacionindService.createCalificacion(payload);
    }

    //LISTAR CALIFICACION POR ID_CRITERIO Y ID_EVALUACIÓN
    @Get()
    async getCriterioEvaluacion(
        @Query('cri_id') cri_id: number,
        @Query('eva_id') eva_id: number
    ){
        return await this.calificacionindService.getCriterioByIdEva(cri_id, eva_id)
    }

    //LISTAR TODOS LOS CRITERIOS CON EVALUACION 
    @Get('criid/evaluacion/:id')
    async getAllevaluacion(@Param('id', ParseIntPipe) id: number) {
        return await this.calificacionindService.getallcriterioetapa(id)
    }

    //LISTAR TODAS LAS CALIFICACIONES POR ID_EVALUACIÓN
    @Get('lista/:id')
    async getAllCalificaciones(@Param('id', ParseIntPipe) id: number) {
        return await this.calificacionindService.getCalificacionByEva(id)
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payloads: { dto: CalificacionindDto, tokenDto: TokenDto}) {
        const { dto, tokenDto } = payloads;
        return await this.calificacionindService.update(id,payloads);
    }
}
