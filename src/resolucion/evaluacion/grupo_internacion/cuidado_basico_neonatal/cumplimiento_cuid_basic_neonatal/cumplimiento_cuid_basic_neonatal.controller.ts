import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoCuidBasNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_basico_neonatal_dto/cumplimiento_cuid_basic_neonatal.dto';
import { CumplimientoCuidBasicNeonatalService } from './cumplimiento_cuid_basic_neonatal.service';

@Controller('cumplimiento-cuid-basic-neonatal')
export class CumplimientoCuidBasicNeonatalController {

    constructor(private readonly cumplimientoCuidBasicNeonatalService: CumplimientoCuidBasicNeonatalService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidBasicNeonatalService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_neona_id') cri_neona_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoCuidBasNeonatalDto) {
        return this.cumplimientoCuidBasicNeonatalService.create(cri_neona_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidBasicNeonatalService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoCuidBasNeonatalDto) {
        return await this.cumplimientoCuidBasicNeonatalService.updateCapacidad(id, dto);
    }
}
