import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoMuestraLabClinicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/toma_muestras_laboratorio_clinico_dto/cumplimiento_tom_muestras.dto';
import { CumplimientoTomMuestrasService } from './cumplimiento_tom_muestras.service';

@Controller('cumplimiento-tom-muestras')
export class CumplimientoTomMuestrasController {

    constructor(private readonly cumplimientoTomMuestrasService: CumplimientoTomMuestrasService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoTomMuestrasService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_muest_cli_id') cri_muest_cli_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoMuestraLabClinicoDto) {
        return this.cumplimientoTomMuestrasService.create(cri_muest_cli_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoTomMuestrasService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoMuestraLabClinicoDto) {
        return await this.cumplimientoTomMuestrasService.updateCapacidad(id, dto);
    }
}
