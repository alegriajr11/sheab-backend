import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioRadioterapiaService } from './criterio_radioterapia.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioRadioterapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/radioterapia_dto/criterio_radioterapia.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterio-radioterapia')
export class CriterioRadioterapiaController {

    constructor(
        private readonly criterioRadioterapiaService: CriterioRadioterapiaService) { }

    //OBTENER CRITERIO  SERVICIO FARMACEUTICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioRadioterapiaService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioRadioterapiaService.getall();
    }

    //CREAR CRITERIO  SERVICIO FARMACEUTICO| POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioRadioterapiaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioRadioterapiaService.create(id, payload);
    }
    //ELIMINAR CRITERIO   SERVICIO FARMACEUTICO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioRadioterapiaService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO   SERVICIO FARMACEUTICO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioRadioterapiaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioRadioterapiaService.update(id, payload);
    }
}
