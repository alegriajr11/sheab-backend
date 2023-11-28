import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoLabClinicoService } from './cumplimiento_lab_clinico.service';
import { CumplimientoLabClinicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_clinico_dto/cumplimiento_lab_clinico.dto';

@Controller('cumplimiento-lab-clinico')
export class CumplimientoLabClinicoController {

    constructor(private readonly cumplimientoLabClinicoService: CumplimientoLabClinicoService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoLabClinicoService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_lab_cli_id') cri_lab_cli_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoLabClinicoDto) {
        return this.cumplimientoLabClinicoService.create(cri_lab_cli_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoLabClinicoService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoLabClinicoDto) {
        return await this.cumplimientoLabClinicoService.updateCapacidad(id, dto);
    }
}
