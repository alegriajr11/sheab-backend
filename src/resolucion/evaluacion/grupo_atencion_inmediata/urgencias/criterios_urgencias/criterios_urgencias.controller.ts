import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosUrgenciasService } from './criterios_urgencias.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioUrgenciasDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/urgencias_dto/criterio_urgencias.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-urgencias')
export class CriteriosUrgenciasController {

    constructor(
        private readonly criteriosUrgenciasService: CriteriosUrgenciasService) { }

    //OBTENER CRITERIO URGENCIAS POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosUrgenciasService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosUrgenciasService.getall();
    }

    //CREAR CRITERIO URGENCIAS POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioUrgenciasDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosUrgenciasService.create(id, payload);
    }

    //ELIMINAR CRITERIO  URGENCIAS
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosUrgenciasService.delete(id, tokenDto);
    }


    //ACTUALIZAR UN CRITERIO  URGENCIAS
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioUrgenciasDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosUrgenciasService.update(id, payload);
    }
}

