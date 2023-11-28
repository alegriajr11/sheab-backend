import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoLabCitologiaService } from './cumplimiento_lab_citologia.service';
import { CumplimientoLabUterinaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_citologias_uterinas_dto/cumplimiento_lab_citologia_uterina.dto';

@Controller('cumplimiento-lab-citologia')
export class CumplimientoLabCitologiaController {

    constructor(private readonly cumplimientoLabCitologiaService: CumplimientoLabCitologiaService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoLabCitologiaService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_lab_ute_id') cri_lab_ute_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoLabUterinaDto) {
        return this.cumplimientoLabCitologiaService.create(cri_lab_ute_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoLabCitologiaService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoLabUterinaDto) {
        return await this.cumplimientoLabCitologiaService.updateCapacidad(id, dto);
    }
}
