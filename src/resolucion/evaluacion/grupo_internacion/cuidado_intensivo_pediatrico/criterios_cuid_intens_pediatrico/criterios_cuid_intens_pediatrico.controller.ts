import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosCuidIntensPediatricoService } from './criterios_cuid_intens_pediatrico.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioCuidIntePediatricoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_pediatrico_dto/criterio_cuid_intens_pediatrico.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-cuid-intens-pediatrico')
export class CriteriosCuidIntensPediatricoController {

    constructor(
        private readonly criteriosCuidIntensPediatricoService: CriteriosCuidIntensPediatricoService) { }

    //OBTENER CRITERIO CUIDADO INTENSIVO PEDIATRICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosCuidIntensPediatricoService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosCuidIntensPediatricoService.getall();
    }


    //CREAR CRITERIO CUIDADO INTENSIVA PEDIATRICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntePediatricoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosCuidIntensPediatricoService.create(id, payload);
    }

    //ELIMINAR CRITERIO CUIDADO INTENSIVO PEDIATRICO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosCuidIntensPediatricoService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO CUIDADO INTENSIVO PEDIATRICO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntePediatricoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosCuidIntensPediatricoService.update(id, payload);
    }
}

