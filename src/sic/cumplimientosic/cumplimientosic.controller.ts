import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CumplimientoSicDto } from 'src/usuario/dto/Sic/cumplimientosic.dto';
import { CumplimientosicService } from './cumplimientosic.service';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('cumplimientosic')
export class CumplimientosicController {

    constructor(private readonly cumplimientosicService: CumplimientosicService) {
    }

    //CREAR CUMPLIMIENTO
    @Post()
    async create(@Body() payloads: { dto: CumplimientoSicDto, tokenDto: TokenDto}) {
        const { dto, tokenDto } = payloads;
        return this.cumplimientosicService.create(payloads);
    }

    //OBTENER CRITERIO Y CALIFICACION POR EVALUACION
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getevaluacion(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientosicService.getCriCalIdeva(id)
    }

    //OBTENER CRITERIO Y CALIFICACION POR EVALUACION
    //@UseGuards(JwtAuthGuard)
    @Get('/cumpliestandar/:id')
    async getcumpliestandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientosicService.getcumpliestandar(id)
    }

    @Get('cumplimiento/cumplesic/:id')
    async getcumplesic(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientosicService.getCriCalIdeva(id)
    }

    //ACTUALIZAR UN CRITERIO  EXTERNA ESPECIALIZADA


    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payloads: { dto: CumplimientoSicDto, tokenDto: TokenDto}) {
        const { dto, tokenDto } = payloads;
        return await this.cumplimientosicService.edit(id,payloads);
    }
}
