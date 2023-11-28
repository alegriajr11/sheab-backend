import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoMedicinaNuclearService } from './cumplimiento_medicina_nuclear.service';
import { CumplimientoMedicinaNuclearDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/medicina_nuclear_dto/cumplimiento_medicina_nuclear.dto';

@Controller('cumplimiento-medicina-nuclear')
export class CumplimientoMedicinaNuclearController {

    constructor(private readonly cumplimientoMedicinaNuclearService: CumplimientoMedicinaNuclearService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoMedicinaNuclearService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('crimed_nucl_id') crimed_nucl_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoMedicinaNuclearDto) {
        return this.cumplimientoMedicinaNuclearService.create(crimed_nucl_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoMedicinaNuclearService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoMedicinaNuclearDto) {
        return await this.cumplimientoMedicinaNuclearService.updateCapacidad(id, dto);
    }
}
