import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoTerapiasService } from './cumplimiento_terapias.service';
import { CumplimientoTerapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/terapias_dto/cumplimiento_terapia.dto';

@Controller('cumplimiento-terapias')
export class CumplimientoTerapiasController {

    constructor(private readonly cumplimientoTerapiasService: CumplimientoTerapiasService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoTerapiasService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('criter_id') criter_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoTerapiaDto) {
        return this.cumplimientoTerapiasService.create(criter_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoTerapiasService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoTerapiaDto) {
        return await this.cumplimientoTerapiasService.updateCapacidad(id, dto);
    }
}
