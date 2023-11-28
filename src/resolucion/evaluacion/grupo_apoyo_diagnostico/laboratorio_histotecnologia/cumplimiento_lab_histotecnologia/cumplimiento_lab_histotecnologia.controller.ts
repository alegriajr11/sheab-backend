import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoLabHistotecnologiaService } from './cumplimiento_lab_histotecnologia.service';
import { CumplimientoLabHistotecnologiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_histotecnologia_dto/cumplimiento_lab_histotec.dto';

@Controller('cumplimiento-lab-histotecnologia')
export class CumplimientoLabHistotecnologiaController {

    constructor(private readonly cumplimientoLabHistotecnologiaService: CumplimientoLabHistotecnologiaService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoLabHistotecnologiaService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_lab_histo_id') cri_lab_histo_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoLabHistotecnologiaDto) {
        return this.cumplimientoLabHistotecnologiaService.create(cri_lab_histo_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoLabHistotecnologiaService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoLabHistotecnologiaDto) {
        return await this.cumplimientoLabHistotecnologiaService.updateCapacidad(id, dto);
    }
}
