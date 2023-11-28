import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { GrupoEvaluacionService } from './grupo_evaluacion.service';
import { GrupoEvaluacionDto } from '../dtos/grupo_evaluacion_dto/grupo_evaluacion.dto';

@Controller('grupo-evaluacion')
export class GrupoEvaluacionController {
    constructor(private readonly grupoEvaluacionService: GrupoEvaluacionService) { }

    //OBTENER TODOS LOS  CRITERIOS
    @Get()
    getAll() {
        return this.grupoEvaluacionService.getall();
    }

    //CREAR EVALUACION
    @Post()
    async create(@Body() dto: GrupoEvaluacionDto) {
        return this.grupoEvaluacionService.create(dto);
    }

    //ELIMINAR CRITERIO  PRETRANSFUNSIONAL
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.grupoEvaluacionService.delete(id);
    }


    //ACTUALIZAR UN CRITERIO PRETRANSFUNSIONAL
    @Put(':id')
    async update(@Param('id') id: number, @Body() dto: GrupoEvaluacionDto) {
        return await this.grupoEvaluacionService.updateGestion(id, dto);
    }
}
