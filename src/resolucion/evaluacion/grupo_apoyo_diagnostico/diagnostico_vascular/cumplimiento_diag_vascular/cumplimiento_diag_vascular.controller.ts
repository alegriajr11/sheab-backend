import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CumplimientoDiagVascularService } from './cumplimiento_diag_vascular.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoDiagnostiVascularDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/diagnostico_vascular_dto/cumplimiento_diagnostico_vascular.dto';

@Controller('cumplimiento-diag-vascular')
export class CumplimientoDiagVascularController {
    constructor(private readonly cumplimientoDiagVascularService: CumplimientoDiagVascularService) { }
    
    //OBTENER un CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoDiagVascularService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('crivac_id') crivac_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoDiagnostiVascularDto) {
        return this.cumplimientoDiagVascularService.create(crivac_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoDiagVascularService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoDiagnostiVascularDto) {
        return await this.cumplimientoDiagVascularService.updateCapacidad(id, dto);
    }
}
