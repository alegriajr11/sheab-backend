import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoCuidIntensPediatricoService } from './cumplimiento_cuid_intens_pediatrico.service';
import { CumplimientoCuidIntePediatricoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_pediatrico_dto/cumplimiento_cuid_intens_pediatrico.dto';

@Controller('cumplimiento-cuid-intens-pediatrico')
export class CumplimientoCuidIntensPediatricoController {

    constructor(private readonly cumplimientoCuidIntensPediatricoService: CumplimientoCuidIntensPediatricoService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidIntensPediatricoService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_int_ped_id') cri_int_ped_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoCuidIntePediatricoDto) {
        return this.cumplimientoCuidIntensPediatricoService.create(cri_int_ped_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidIntensPediatricoService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoCuidIntePediatricoDto) {
        return await this.cumplimientoCuidIntensPediatricoService.updateCapacidad(id, dto);
    }
}
