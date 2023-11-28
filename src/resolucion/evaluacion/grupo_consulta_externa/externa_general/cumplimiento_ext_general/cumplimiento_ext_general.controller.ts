import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoExternaGeneralDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/externa_general_dto/cumplimiento_ext_general.dto';
import { CumplimientoExtGeneralService } from './cumplimiento_ext_general.service';

@Controller('cumplimiento-ext-general')
export class CumplimientoExtGeneralController {

    constructor(private readonly cumplimientoExtGeneralService: CumplimientoExtGeneralService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoExtGeneralService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('criextg_id') criextg_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoExternaGeneralDto) {
        return this.cumplimientoExtGeneralService.create(criextg_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoExtGeneralService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoExternaGeneralDto) {
        return await this.cumplimientoExtGeneralService.updateCapacidad(id, dto);
    }
}
