import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoServiciosDto } from 'src/resolucion/dtos/evaluacion_dtos/todos_servicios_dto/servicios_dto/cumplimiento_servicios.dto';
import { CumplimientoTodosServiciosService } from './cumplimiento_todos_servicios.service';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('cumplimiento-todos-servicios')
export class CumplimientoTodosServiciosController {

    constructor(private readonly cumplimientoTodosServiciosService: CumplimientoTodosServiciosService) { }

    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoTodosServiciosService.findById(id)
    }


    //CREAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    async create(@Body() payload: { dto: CumplimientoServiciosDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.cumplimientoTodosServiciosService.create(payload);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoTodosServiciosService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoServiciosDto) {
        return await this.cumplimientoTodosServiciosService.updateCumplimiento(id, dto);
    }
}
