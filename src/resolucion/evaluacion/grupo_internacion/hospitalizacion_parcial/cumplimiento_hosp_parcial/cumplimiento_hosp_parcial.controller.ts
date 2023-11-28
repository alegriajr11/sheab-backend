import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoHospitalizacionParcialDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_parcial_dto/cumplimiento_hosp_parcial.dto';
import { CumplimientoHospParcialService } from './cumplimiento_hosp_parcial.service';

@Controller('cumplimiento-hosp-parcial')
export class CumplimientoHospParcialController {

    constructor(private readonly cumplimientoHospParcialService: CumplimientoHospParcialService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHospParcialService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('crihosp_parc_id') crihosp_parc_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoHospitalizacionParcialDto) {
        return this.cumplimientoHospParcialService.create(crihosp_parc_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHospParcialService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoHospitalizacionParcialDto) {
        return await this.cumplimientoHospParcialService.updateCapacidad(id, dto);
    }
}
