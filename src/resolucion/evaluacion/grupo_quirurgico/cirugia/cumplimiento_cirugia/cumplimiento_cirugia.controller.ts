import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoCirugiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_quirurgico_dtos/cirugia_dto/cumplimiento_cirugia.dto';
import { CumplimientoCirugiaService } from './cumplimiento_cirugia.service';

@Controller('cumplimiento-cirugia')
export class CumplimientoCirugiaController {

    constructor(private readonly cumplimientoCirugiaService: CumplimientoCirugiaService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCirugiaService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_ciru_id') cri_ciru_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoCirugiaDto) {
        return this.cumplimientoCirugiaService.create(cri_ciru_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCirugiaService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoCirugiaDto) {
        return await this.cumplimientoCirugiaService.updateCapacidad(id, dto);
    }
}
