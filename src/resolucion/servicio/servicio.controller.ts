import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { ServiciosnDto } from '../dtos/servicios/servicios.dto';

@Controller('servicio')
export class ServicioController {

    constructor(private readonly servicioService: ServicioService) { }

    //OBTENER TODOS LOS  CRITERIOS
    @Get()
    getAll() {
        return this.servicioService.getall();
    }

    //CREAR EVALUACION
    @Post()
    async create(@Param('id') id: number,@Body() dto: ServiciosnDto) {
        return this.servicioService.create(id, dto);
    }

    //ELIMINAR CRITERIO  PRETRANSFUNSIONAL
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.servicioService.delete(id);
    }


    //ACTUALIZAR UN CRITERIO PRETRANSFUNSIONAL
    @Put(':id')
    async update(@Param('id') id: number, @Body() dto: ServiciosnDto) {
        return await this.servicioService.updateGestion(id, dto);
    }
}
