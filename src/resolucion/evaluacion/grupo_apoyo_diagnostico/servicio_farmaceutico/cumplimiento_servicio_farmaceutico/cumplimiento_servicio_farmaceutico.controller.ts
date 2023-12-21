import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoServicioFarmaceuticoService } from './cumplimiento_servicio_farmaceutico.service';
import { CumplimientoSerFarmaceuticoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/servicio_farmaceutico_dto/cumplimiento_s_farmaceutico.dto';

@Controller('cumplimiento-servicio-farmaceutico')
export class CumplimientoServicioFarmaceuticoController {

    constructor(private readonly cumplimientoServicioFarmaceuticoService: CumplimientoServicioFarmaceuticoService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoServicioFarmaceuticoService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('criser_farm_id') criser_farm_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoSerFarmaceuticoDto) {
        return this.cumplimientoServicioFarmaceuticoService.create(criser_farm_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoServicioFarmaceuticoService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoSerFarmaceuticoDto) {
        return await this.cumplimientoServicioFarmaceuticoService.updateCapacidad(id, dto);
    }

    //OBTENER LOS CUMPLIMIENTOS POR EVALUACION
    // @UseGuards(JwtAuthGuard)
    @Get('cumplimientos/evaluacion/:id')
    async getCumplimientoForEva(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoServicioFarmaceuticoService.getCumplimientoForEva(id)
    }
}
