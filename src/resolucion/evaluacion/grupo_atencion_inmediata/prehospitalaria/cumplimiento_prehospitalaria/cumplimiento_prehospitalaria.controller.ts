import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoPrehospitalariaService } from './cumplimiento_prehospitalaria.service';
import { CumplimientoPrehospitalariaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/prehospitalaria_dto/cumplimiento_prehospitalaria.dto';

@Controller('cumplimiento-prehospitalaria')
export class CumplimientoPrehospitalariaController {

    constructor(private readonly cumplimientoPrehospitalariaService: CumplimientoPrehospitalariaService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoPrehospitalariaService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('cripreh_id') cripreh_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoPrehospitalariaDto) {
        return this.cumplimientoPrehospitalariaService.create(cripreh_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoPrehospitalariaService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoPrehospitalariaDto) {
        return await this.cumplimientoPrehospitalariaService.updateCapacidad(id, dto);
    }
}
