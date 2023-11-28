import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosMuesCuelloService } from './criterios_mues_cuello.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioCuelloUterinoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/toma_muestras_cuello_uterino_dto/criterio_tom_muest_cuello.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-mues-cuello')
export class CriteriosMuesCuelloController {

    constructor(
        private readonly criteriosMuesCuelloService: CriteriosMuesCuelloService) { }

    //OBTENER CRITERIO TOMA MUESTRAS CUELLO UTERINO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosMuesCuelloService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosMuesCuelloService.getall();
    }


    //CREAR CRITERIO TOMA MUESTAS CUELLO UTERINO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuelloUterinoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosMuesCuelloService.create(id, payload);
    }

    //ELIMINAR CRITERIO  TOMA MUESTAS CUELLO UTERINO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosMuesCuelloService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO   TOMA MUESTAS CUELLO UTERINO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuelloUterinoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosMuesCuelloService.update(id, payload);
    }
}
