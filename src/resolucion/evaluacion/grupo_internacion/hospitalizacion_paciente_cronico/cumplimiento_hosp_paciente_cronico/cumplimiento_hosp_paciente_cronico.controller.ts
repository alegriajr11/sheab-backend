import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoHospitCronicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_paciente_cronico_dto/cumplimiento_hosp_paciente_cron.dto';
import { CumplimientoHospPacienteCronicoService } from './cumplimiento_hosp_paciente_cronico.service';

@Controller('cumplimiento-hosp-paciente-cronico')
export class CumplimientoHospPacienteCronicoController {

    constructor(private readonly cumplimientoHospPacienteCronicoService: CumplimientoHospPacienteCronicoService) { }
    
    //OBTENER UN CUMPLIMIENTO
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHospPacienteCronicoService.findById(id)
    }


    //CREAR CUMPLIMIENTO
   // @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('create')
    async create( @Query('crihosp_cron_id') crihosp_cron_id: number,
    @Query('eva_id') eva_id: number, @Body() dto: CumplimientoHospitCronicoDto) {
        return this.cumplimientoHospPacienteCronicoService.create(crihosp_cron_id,eva_id, dto);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoHospPacienteCronicoService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CumplimientoHospitCronicoDto) {
        return await this.cumplimientoHospPacienteCronicoService.updateCapacidad(id, dto);
    }
}
