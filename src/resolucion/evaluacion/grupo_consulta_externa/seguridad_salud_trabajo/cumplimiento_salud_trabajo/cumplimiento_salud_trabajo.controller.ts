import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoSaludTrabajoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/seguridad_salud_trabajo_dto/cumplimiento_salud_trabajo.dto';
import { CumplimientoSaludTrabajoService } from './cumplimiento_salud_trabajo.service';

@Controller('cumplimiento-salud-trabajo')
export class CumplimientoSaludTrabajoController {

    constructor(private readonly cumplimientoSaludTrabajoService: CumplimientoSaludTrabajoService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoSaludTrabajoService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('criextg_id') criextg_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoSaludTrabajoDto) {
        return this.cumplimientoSaludTrabajoService.create(criextg_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoSaludTrabajoService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoSaludTrabajoDto) {
        return await this.cumplimientoSaludTrabajoService.updateCapacidad(id, dto);
    }
}
