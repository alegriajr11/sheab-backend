import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoCuidIntensAdultoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_adulto_dto/cumplimiento_cuid_intens_adulto.dto';
import { CumplimientoCuidIntensAdultoService } from './cumplimiento_cuid_intens_adulto.service';

@Controller('cumplimiento-cuid-intens-adulto')
export class CumplimientoCuidIntensAdultoController {

    constructor(private readonly cumplimientoCuidIntensAdultoService: CumplimientoCuidIntensAdultoService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidIntensAdultoService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_int_adult_id') cri_int_adult_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoCuidIntensAdultoDto) {
        return this.cumplimientoCuidIntensAdultoService.create(cri_int_adult_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidIntensAdultoService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoCuidIntensAdultoDto) {
        return await this.cumplimientoCuidIntensAdultoService.updateCapacidad(id, dto);
    }
}
