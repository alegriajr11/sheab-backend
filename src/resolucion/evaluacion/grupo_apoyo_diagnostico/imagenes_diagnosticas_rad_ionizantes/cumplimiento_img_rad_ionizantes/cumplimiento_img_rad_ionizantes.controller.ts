import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoImgRadIonizantesService } from './cumplimiento_img_rad_ionizantes.service';
import { CumplimientoImgRadIonizantesDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/imagenes_diagnosticas_rad_ionizantes_dto/cumplimiento_img_rad_ionizantes.dto';

@Controller('cumplimiento-img-rad-ionizantes')
export class CumplimientoImgRadIonizantesController {

    constructor(private readonly cumplimientoImgRadIonizantesService: CumplimientoImgRadIonizantesService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoImgRadIonizantesService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_imgioni_id') cri_imgioni_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoImgRadIonizantesDto) {
        return this.cumplimientoImgRadIonizantesService.create(cri_imgioni_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoImgRadIonizantesService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoImgRadIonizantesDto) {
        return await this.cumplimientoImgRadIonizantesService.updateCapacidad(id, dto);
    }
}
