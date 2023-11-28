import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoCuidInteNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_neonatal_dto/cumplimiento_cuid_intens_neonatal.dto';
import { CumplimientoCuidIntensNeonatalService } from './cumplimiento_cuid_intens_neonatal.service';

@Controller('cumplimiento-cuid-intens-neonatal')
export class CumplimientoCuidIntensNeonatalController {

    constructor(private readonly cumplimientoCuidIntensNeonatalService: CumplimientoCuidIntensNeonatalService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidIntensNeonatalService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_neona_id') cri_neona_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoCuidInteNeonatalDto) {
        return this.cumplimientoCuidIntensNeonatalService.create(cri_neona_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidIntensNeonatalService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoCuidInteNeonatalDto) {
        return await this.cumplimientoCuidIntensNeonatalService.updateCapacidad(id, dto);
    }
}
