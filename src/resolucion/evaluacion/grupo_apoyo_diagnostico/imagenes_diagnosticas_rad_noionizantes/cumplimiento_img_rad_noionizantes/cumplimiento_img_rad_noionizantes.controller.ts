import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoImgRadNoionizantesService } from './cumplimiento_img_rad_noionizantes.service';
import { CumplimientoImgRadNoIonizantesDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/imagenes_diagnosticas_rad_noionizantes_dto/cumplimiento_img_rad_noionizantes.dto';

@Controller('cumplimiento-img-rad-noionizantes')
export class CumplimientoImgRadNoionizantesController {

    constructor(private readonly cumplimientoImgRadNoionizantesService: CumplimientoImgRadNoionizantesService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoImgRadNoionizantesService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_img_noioni_id') cri_img_noioni_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoImgRadNoIonizantesDto) {
        return this.cumplimientoImgRadNoionizantesService.create(cri_img_noioni_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoImgRadNoionizantesService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoImgRadNoIonizantesDto) {
        return await this.cumplimientoImgRadNoionizantesService.updateCapacidad(id, dto);
    }
}
