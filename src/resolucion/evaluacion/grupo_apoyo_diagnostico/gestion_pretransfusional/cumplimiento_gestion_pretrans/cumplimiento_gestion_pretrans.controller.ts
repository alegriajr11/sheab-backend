import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoGestionPretransService } from './cumplimiento_gestion_pretrans.service';
import { CumplimientoGestionPretransfusionalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/gestion_pretransfusional_dto/cumplimiento_gestion_pretrans.dto';

@Controller('cumplimiento-gestion-pretrans')
export class CumplimientoGestionPretransController {

    constructor(private readonly cumplimientoGestionPretransService: CumplimientoGestionPretransService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoGestionPretransService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('crigestpre_id') crigestpre_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoGestionPretransfusionalDto) {
        return this.cumplimientoGestionPretransService.create(crigestpre_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoGestionPretransService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoGestionPretransfusionalDto) {
        return await this.cumplimientoGestionPretransService.updateCapacidad(id, dto);
    }
}
