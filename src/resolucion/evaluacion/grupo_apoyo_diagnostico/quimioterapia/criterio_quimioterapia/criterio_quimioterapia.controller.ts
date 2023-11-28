import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioQuimioterapiaService } from './criterio_quimioterapia.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioQuimioterapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/quimioterapia_dto/criterio_quimioterapia.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterio-quimioterapia')
export class CriterioQuimioterapiaController {

    constructor(
        private readonly criterioQuimioterapiaService: CriterioQuimioterapiaService) { }

    //OBTENER CRITERIO QUIMIOTERAPIA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioQuimioterapiaService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioQuimioterapiaService.getall();
    }

    //CREAR CRITERIO QUIMIOTERAPIA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioQuimioterapiaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioQuimioterapiaService.create(id, payload);
    }

    //ELIMINAR CRITERIO  QUIMIOTERAPIA
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioQuimioterapiaService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO   QUIMIOTERAPIA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioQuimioterapiaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioQuimioterapiaService.update(id, payload);
    }
}
