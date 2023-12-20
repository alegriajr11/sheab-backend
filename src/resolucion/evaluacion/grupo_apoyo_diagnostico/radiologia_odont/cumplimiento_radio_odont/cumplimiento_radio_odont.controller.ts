import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoRadioOdontService } from './cumplimiento_radio_odont.service';
import { CumplimientoRadiologiaOdontoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/radiologia_odont_dto/cumplimiento_radio_odont.dto';

@Controller('cumplimiento-radio-odont')
export class CumplimientoRadioOdontController {

    constructor(private readonly cumplimientoRadioOdontService: CumplimientoRadioOdontService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoRadioOdontService.findById(id)
    }

    //OBTENER LOS CUMPLIMIENTOS POR EVALUACION
    // @UseGuards(JwtAuthGuard)
    @Get('cumplimientos/evaluacion/:id')
    async getCumplimientoForEva(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoRadioOdontService.getCumplimientoForEva(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('crirad_odon_id') crirad_odon_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoRadiologiaOdontoDto) {
        return this.cumplimientoRadioOdontService.create(crirad_odon_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoRadioOdontService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoRadiologiaOdontoDto) {
        return await this.cumplimientoRadioOdontService.updateCapacidad(id, dto);
    }
}
