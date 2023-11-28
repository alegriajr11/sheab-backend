import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CalificacionipsAjusteService } from './calificacionips_ajuste.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CalificacionAjusteDto } from 'src/usuario/dto/SpIps/calificaciones/calificacionajuste.dto';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('calificacionips-ajuste')
export class CalificacionipsAjusteController {

    constructor(private readonly calificacionipsAjusteService: CalificacionipsAjusteService) {
    }


    //LISTAR CALIFICACION POR ID_CRITERIO Y ID_EVALUACIÓN - ETAPA AJUSTE
    @Get()
    async getCriterioEvaluacion(
        @Query('cri_id') cri_id: number,
        @Query('eva_id') eva_id: number,
        @Query('id_acta') id_acta: number
    ) {
        return await this.calificacionipsAjusteService.getCriterioByIdEva(cri_id, eva_id, id_acta)
    }

    //SOLICITAR LAS CALIFICACIONES QUE LE PERTENECEN AL ACTA 
    //@UseGuards(JwtAuthGuard)
    @Get('/calificaciones/evaluacion/acta')
    async getCalificaciones(
        @Query('evips_id') evips_id: number,
        @Query('id_acta') id_acta: number
    ) {
        return await this.calificacionipsAjusteService.listarTodasLasCalificacionesPorIdActa(evips_id, id_acta)
    }


    //actualizar calificacion
    @UseGuards(JwtAuthGuard)
    //@UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto_calificacion: CalificacionAjusteDto, tokenDto: TokenDto }) {
        const { dto_calificacion, tokenDto } = payload;
        return await this.calificacionipsAjusteService.update(id, payload);
    }

    //eliminar calificacion
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.calificacionipsAjusteService.delete(id);
    }

    //creacion de la calificacion
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Post('calificacion')
    async create(
        @Body() payload: { dto_calificacion: CalificacionAjusteDto, tokenDto: TokenDto }) {
        const { dto_calificacion, tokenDto } = payload;
        return await this.calificacionipsAjusteService.create(payload);
    }

    @Get('/prueba/de/prueba/de/prueba')
    async getPruebaDePruebaDePrueba(
        @Query('evips_id') evips_id: number,
        @Query('id_acta') id_acta: number
    ) {
        return await this.calificacionipsAjusteService.getallCalCrixEva(evips_id, id_acta)
    }

}
