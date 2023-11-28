import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoHemodIntervenService } from './cumplimiento_hemod_interven.service';
import { CumplimientoHermodinamiaIntervenDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/hemodinamia_intervencionismo_dto/cumplimiento_hemo_inter.dto.dto';

@Controller('cumplimiento-hemod-interven')
export class CumplimientoHemodIntervenController {

    constructor(private readonly cumplimientoHemodIntervenService: CumplimientoHemodIntervenService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHemodIntervenService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('criherminte_id') criherminte_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoHermodinamiaIntervenDto) {
        return this.cumplimientoHemodIntervenService.create(criherminte_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHemodIntervenService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoHermodinamiaIntervenDto) {
        return await this.cumplimientoHemodIntervenService.updateCapacidad(id, dto);
    }
}
