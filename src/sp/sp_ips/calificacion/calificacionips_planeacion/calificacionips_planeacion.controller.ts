import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CalificacionipsPlaneacionService } from './calificacionips_planeacion.service';
import { CalificacionPlaneacionDto } from 'src/usuario/dto/SpIps/calificaciones/calificacionplaneacion.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('calificacionips-planeacion')
export class CalificacionipsPlaneacionController {

    constructor(private readonly calificacionipsPlaneacionService: CalificacionipsPlaneacionService) {
    }

    //LISTAR CALIFICACION POR ID_CRITERIO Y ID_EVALUACIÓN - ETAPA AJUSTE
    @Get()
    async getCriterioEvaluacion(
        @Query('cri_id') cri_id: number,
        @Query('eva_id') eva_id: number,
        @Query('id_acta') id_acta: number
    ) {
        return await this.calificacionipsPlaneacionService.getCriterioByIdEva(cri_id, eva_id, id_acta)
    }

    //SOLICITAR LAS CALIFICACIONES QUE LE PERTENECEN AL ACTA 
    @UseGuards(JwtAuthGuard)
    @Get('/calificaciones/evaluacion/acta')
    async getCalificaciones(
        @Query('evips_id') evips_id: number,
        @Query('id_acta') id_acta: number
    ) {
        return await this.calificacionipsPlaneacionService.listarTodasLasCalificacionesPorIdActa(evips_id, id_acta)
    }

    //actualizar calificacion
    @UseGuards(JwtAuthGuard)
    //@UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body()payload: { dto_calificacion: CalificacionPlaneacionDto, tokenDto: TokenDto}) {
        const { dto_calificacion, tokenDto } = payload;
        return await this.calificacionipsPlaneacionService.update(id, payload);
    }

    //eliminar calificacion
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.calificacionipsPlaneacionService.delete(id);
    }

    //creacion de la calificacion
    @UseGuards(JwtAuthGuard)
    //@UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Post('calificacion')
    async create(
    @Body()payload: { dto_calificacion: CalificacionPlaneacionDto, tokenDto: TokenDto}   ) {
        const { dto_calificacion, tokenDto } = payload;
        return await this.calificacionipsPlaneacionService.create(payload);
    }

}
