import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoHospitalizacionMentalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_salud_mental_dto/cumplimiento_hosp_salud_mental.dto';
import { CumplimientoHospSaludMentalService } from './cumplimiento_hosp_salud_mental.service';

@Controller('cumplimiento-hosp-salud-mental')
export class CumplimientoHospSaludMentalController {

    constructor(private readonly cumplimientoHospSaludMentalService: CumplimientoHospSaludMentalService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHospSaludMentalService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('crihosp_ment_id') crihosp_ment_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoHospitalizacionMentalDto) {
        return this.cumplimientoHospSaludMentalService.create(crihosp_ment_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHospSaludMentalService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoHospitalizacionMentalDto) {
        return await this.cumplimientoHospSaludMentalService.updateCapacidad(id, dto);
    }
}
