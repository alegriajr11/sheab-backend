import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoEspecializadaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/externa_especializada_dto/cumplimiento_especializada.dto';
import { CumplimientoExtEspecializadaService } from './cumplimiento_ext_especializada.service';

@Controller('cumplimiento-ext-especializada')
export class CumplimientoExtEspecializadaController {

    constructor(private readonly cumplimientoExtEspecializadaService: CumplimientoExtEspecializadaService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoExtEspecializadaService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('criurge_id') criurge_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoEspecializadaDto) {
        return this.cumplimientoExtEspecializadaService.create(criurge_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoExtEspecializadaService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoEspecializadaDto) {
        return await this.cumplimientoExtEspecializadaService.updateCapacidad(id, dto);
    }
}
