import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoRadioterapiaService } from './cumplimiento_radioterapia.service';
import { CumplimientoRadioterapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/radioterapia_dto/cumplimiento_radioterapia.dto';

@Controller('cumplimiento-radioterapia')
export class CumplimientoRadioterapiaController {

    constructor(private readonly cumplimientoRadioterapiaService: CumplimientoRadioterapiaService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoRadioterapiaService.findById(id)
    }

    //OBTENER LOS CUMPLIMIENTOS POR EVALUACION
    // @UseGuards(JwtAuthGuard)
    @Get('cumplimientos/evaluacion/:id')
    async getCumplimientoForEva(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoRadioterapiaService.getCumplimientoForEva(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('crirad_ter_id') crirad_ter_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoRadioterapiaDto) {
        return this.cumplimientoRadioterapiaService.create(crirad_ter_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoRadioterapiaService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoRadioterapiaDto) {
        return await this.cumplimientoRadioterapiaService.updateCapacidad(id, dto);
    }
}
