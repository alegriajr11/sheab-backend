import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoCuidIntermAdultoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_adulto_dto/cumplimiento_cuid_inter_adulto.dto';
import { CumplimientoCuidInterAdultoService } from './cumplimiento_cuid_inter_adulto.service';

@Controller('cumplimiento-cuid-inter-adulto')
export class CumplimientoCuidInterAdultoController {

    constructor(private readonly cumplimientoCuidInterAdultoService: CumplimientoCuidInterAdultoService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidInterAdultoService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_inter_adult_id') cri_inter_adult_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoCuidIntermAdultoDto) {
        return this.cumplimientoCuidInterAdultoService.create(cri_inter_adult_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidInterAdultoService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoCuidIntermAdultoDto) {
        return await this.cumplimientoCuidInterAdultoService.updateCapacidad(id, dto);
    }
}
