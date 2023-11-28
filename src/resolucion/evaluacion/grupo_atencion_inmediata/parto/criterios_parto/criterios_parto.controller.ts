import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosPartoService } from './criterios_parto.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioPartoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/parto_dto/criterio_parto.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-parto')
export class CriteriosPartoController {

    constructor(
        private readonly criteriosPartoService: CriteriosPartoService) { }

    //OBTENER CRITERIO PARTO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosPartoService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosPartoService.getall();
    }

    //CREAR CRITERIO PARTO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioPartoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosPartoService.create(id, payload);
    }


    //ELIMINAR CRITERIO  PARTO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosPartoService.delete(id, tokenDto);
    }


    //ACTUALIZAR UN CRITERIO  PARTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioPartoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosPartoService.update(id, payload);
    }
}
