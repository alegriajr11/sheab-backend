import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoCuidIntermPediatricoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_pediatrico_dto/cumplimiento_cuid_inter_pediatrico.dto';
import { CumplimientoCuidInterPediatricoService } from './cumplimiento_cuid_inter_pediatrico.service';

@Controller('cumplimiento-cuid-inter-pediatrico')
export class CumplimientoCuidInterPediatricoController {

    constructor(private readonly cumplimientoCuidInterPediatricoService: CumplimientoCuidInterPediatricoService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidInterPediatricoService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cri_inter_pedia_id') cri_inter_pedia_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoCuidIntermPediatricoDto) {
        return this.cumplimientoCuidInterPediatricoService.create(cri_inter_pedia_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoCuidInterPediatricoService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoCuidIntermPediatricoDto) {
        return await this.cumplimientoCuidInterPediatricoService.updateCapacidad(id, dto);
    }
}
