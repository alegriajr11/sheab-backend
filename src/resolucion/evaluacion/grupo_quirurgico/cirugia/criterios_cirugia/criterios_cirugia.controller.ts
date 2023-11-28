import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosCirugiaService } from './criterios_cirugia.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioCirugiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_quirurgico_dtos/cirugia_dto/criterio_cirugia.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-cirugia')
export class CriteriosCirugiaController {

    constructor(
        private readonly criteriosCirugiaService: CriteriosCirugiaService) { }

    //OBTENER CRITERIO CIRUGIA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosCirugiaService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosCirugiaService.getall();
    }

    //CREAR CRITERIO CIRUGIA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCirugiaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosCirugiaService.create(id, payload);
    }

    //ELIMINAR CRITERIO CIRUGIA
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosCirugiaService.delete(id, tokenDto);
    }


    //ACTUALIZAR UN CRITERIO CIRUGIA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCirugiaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosCirugiaService.update(id, payload);
    }
}
