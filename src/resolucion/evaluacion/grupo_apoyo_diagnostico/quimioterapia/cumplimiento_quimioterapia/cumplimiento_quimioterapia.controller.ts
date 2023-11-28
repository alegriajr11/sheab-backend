import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoQuimioterapiaService } from './cumplimiento_quimioterapia.service';
import { CumplimientoQuimioterapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/quimioterapia_dto/cumplimiento_quimioterapia.dto';

@Controller('cumplimiento-quimioterapia')
export class CumplimientoQuimioterapiaController {

    constructor(private readonly cumplimientoQuimioterapiaService: CumplimientoQuimioterapiaService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoQuimioterapiaService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('criquim_id') criquim_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoQuimioterapiaDto) {
        return this.cumplimientoQuimioterapiaService.create(criquim_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoQuimioterapiaService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoQuimioterapiaDto) {
        return await this.cumplimientoQuimioterapiaService.updateCapacidad(id, dto);
    }
}
