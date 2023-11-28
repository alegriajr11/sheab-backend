import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoCuelloUterinoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/toma_muestras_cuello_uterino_dto/cumplimiento_tom_muest_cuello.dto';
import { CumplimientoMuesCuelloService } from './cumplimiento_mues_cuello.service';


@Controller('cumplimiento-mues-cuello')
export class CumplimientoMuesCuelloController {

    constructor(private readonly cumplimientoMuesCuelloService: CumplimientoMuesCuelloService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoMuesCuelloService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_cuel_ute_id') cri_cuel_ute_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoCuelloUterinoDto) {
        return this.cumplimientoMuesCuelloService.create(cri_cuel_ute_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoMuesCuelloService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoCuelloUterinoDto) {
        return await this.cumplimientoMuesCuelloService.updateCapacidad(id, dto);
    }
}
