import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoConsumoPsicoactivasDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_basico_consumo_psicoactivas_dto/cumplimiento_cuid_cons_psicoact.dto';
import { CumplimientoConsPsicoactivasService } from './cumplimiento_cons_psicoactivas.service';

@Controller('cumplimiento-cons-psicoactivas')
export class CumplimientoConsPsicoactivasController {

    constructor(private readonly cumplimientoConsPsicoactivasService: CumplimientoConsPsicoactivasService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoConsPsicoactivasService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_cons_psic_id') cri_cons_psic_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoConsumoPsicoactivasDto) {
        return this.cumplimientoConsPsicoactivasService.create(cri_cons_psic_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoConsPsicoactivasService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoConsumoPsicoactivasDto) {
        return await this.cumplimientoConsPsicoactivasService.updateCapacidad(id, dto);
    }
}
