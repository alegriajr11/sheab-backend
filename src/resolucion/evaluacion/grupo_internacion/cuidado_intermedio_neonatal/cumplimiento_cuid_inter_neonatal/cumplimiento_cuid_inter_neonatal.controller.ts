import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoCuidIntermNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_neonatal_dto/cumplimiento_cuid_inter_neonatal.dto';
import { CumplimientoCuidInterNeonatalService } from './cumplimiento_cuid_inter_neonatal.service';

@Controller('cumplimiento-cuid-inter-neonatal')
export class CumplimientoCuidInterNeonatalController {

    constructor(private readonly cumplimientoCuidInterNeonatalService: CumplimientoCuidInterNeonatalService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidInterNeonatalService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cump_inter_neona_id') cump_inter_neona_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoCuidIntermNeonatalDto) {
        return this.cumplimientoCuidInterNeonatalService.create(cump_inter_neona_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidInterNeonatalService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoCuidIntermNeonatalDto) {
        return await this.cumplimientoCuidInterNeonatalService.updateCapacidad(id, dto);
    }
}
