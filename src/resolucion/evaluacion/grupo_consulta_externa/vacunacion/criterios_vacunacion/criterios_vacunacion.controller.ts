import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosVacunacionService } from './criterios_vacunacion.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioVacunacionDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/vacunacion_dto/criterio_vacunacion.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-vacunacion')
export class CriteriosVacunacionController {

    constructor(
        private readonly criteriosVacunacionService: CriteriosVacunacionService) { }

    //OBTENER CRITERIO VACUNACION POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosVacunacionService.getCriterioForEstandar(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosVacunacionService.getall();
    }

    //CREAR CRITERIO VACUNACION POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioVacunacionDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosVacunacionService.create(id, payload);
    }

    //ELIMINAR CRITERIO VACUNACION
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosVacunacionService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO VACUNACION
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioVacunacionDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosVacunacionService.update(id, payload);
    }
}
