import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoHospitalizacionDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_dto/cumplimiento_hospitalizacion.dto';
import { CumplimientoHospitalizacionService } from './cumplimiento_hospitalizacion.service';

@Controller('cumplimiento-hospitalizacion')
export class CumplimientoHospitalizacionController {

    constructor(private readonly cumplimientoHospitalizacionService: CumplimientoHospitalizacionService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHospitalizacionService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('crihosp_id') crihosp_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoHospitalizacionDto) {
        return this.cumplimientoHospitalizacionService.create(crihosp_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHospitalizacionService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoHospitalizacionDto) {
        return await this.cumplimientoHospitalizacionService.updateCapacidad(id, dto);
    }
}
