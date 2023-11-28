import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CalificacionpamecService } from './calificacionpamec.service';
import { CalificacionPamDto } from 'src/usuario/dto/Pamec/calificacionpam.dto';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('calificacionpamec')
export class CalificacionpamecController {
    constructor(
        private readonly calificacionpamecService: CalificacionpamecService
    ) { }

    //listar todas las calificaciones
    @Get('estan')
    async getAllestandar() {
        return await this.calificacionpamecService.getall()
    }

    
    //OBTENER CRITERIO Y CALIFICACION POR EVALUACION
    //@UseGuards(JwtAuthGuard)
    @Get('/evaluacion/:id')
    async getevaluacion(@Param('id', ParseIntPipe) id: number) {
        return await this.calificacionpamecService.getCriCalIdeva(id)
    }

    // CREAR CALIFICACION
    @Post()
    async create( @Body()payload: { dto: CalificacionPamDto, tokenDto: TokenDto} ) {
        const { dto, tokenDto } = payload;
        return this.calificacionpamecService.create(payload);
    }

    //ACTUALIZAR CALIFICACION
    @Put(':id')
    async update(@Param('id') id: number, @Body() payload: { dto: CalificacionPamDto, tokenDto: TokenDto}) {
        const { dto, tokenDto } = payload;
        return await this.calificacionpamecService.update(id, payload);
    }

    //LISTAR TODOS LAS CALIFICACIONES CON EVALUACION 
    @Get('cal/evaluacion/:id')
    async getAllevaluacion(@Param('id') id: number) {
        return await this.calificacionpamecService.getallcriterioxtitulouno(id)
    }

}
