import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CalificacionipsImplementacionService } from './calificacionips_implementacion.service';
import { CalificacionImpleDto } from 'src/usuario/dto/SpIps/calificaciones/calificacionimplementacion.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('calificacionips-implementacion')
export class CalificacionipsImplementacionController {

    constructor(private readonly calificacionipsImplementacionService: CalificacionipsImplementacionService) {
    }


    //LISTAR CALIFICACION POR ID_CRITERIO Y ID_EVALUACIÓN - ETAPA AJUSTE
    @Get()
    async getCriterioEvaluacion(
        @Query('cri_id') cri_id: number,
        @Query('eva_id') eva_id: number,
        @Query('id_acta') id_acta: number
    ) {
        return await this.calificacionipsImplementacionService.getCriterioByIdEva(cri_id, eva_id, id_acta)
    }

    //SOLICITAR LAS CALIFICACIONES QUE LE PERTENECEN AL ACTA 
    @UseGuards(JwtAuthGuard)
    @Get('/calificaciones/evaluacion/acta')
    async getCalificaciones(
        @Query('evips_id') evips_id: number,
        @Query('id_acta') id_acta: number
    ) {
        return await this.calificacionipsImplementacionService.listarTodasLasCalificacionesPorIdActa(evips_id, id_acta)
    }

    //actualizar calificacion
    //@UseGuards(JwtAuthGuard)
    //@UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto_calificacion: CalificacionImpleDto, tokenDto: TokenDto }) {
        const { dto_calificacion, tokenDto } = payload;
        return await this.calificacionipsImplementacionService.update(id, payload);
    }

    //eliminar calificacion
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.calificacionipsImplementacionService.delete(id);
    }

    //creacion de la calificacion
    @UseGuards(JwtAuthGuard)
    //@UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Post('calificacion')
    async create(
        @Body() payload: { dto_calificacion: CalificacionImpleDto, tokenDto: TokenDto }) {
        const { dto_calificacion, tokenDto } = payload;
        return await this.calificacionipsImplementacionService.create(payload);
    }

}
