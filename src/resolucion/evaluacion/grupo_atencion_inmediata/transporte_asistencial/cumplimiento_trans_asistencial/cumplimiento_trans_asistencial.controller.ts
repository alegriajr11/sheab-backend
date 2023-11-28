import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoTranspAsistencialDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/transporte_asistencial_dto/cumplimiento_trans_asistencial.dto';
import { CumplimientoTransAsistencialService } from './cumplimiento_trans_asistencial.service';

@Controller('cumplimiento-trans-asistencial')
export class CumplimientoTransAsistencialController {

    constructor(private readonly CumplimientoTransAsistencialService: CumplimientoTransAsistencialService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.CumplimientoTransAsistencialService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_trans_asis_id') cri_trans_asis_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoTranspAsistencialDto) {
        return this.CumplimientoTransAsistencialService.create(cri_trans_asis_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.CumplimientoTransAsistencialService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoTranspAsistencialDto) {
        return await this.CumplimientoTransAsistencialService.updateCapacidad(id, dto);
    }
}
