import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosCuidInterPediatricoService } from './criterios_cuid_inter_pediatrico.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioCuidIntermPediatricoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_pediatrico_dto/criterio_cuid_inter_pediatrico.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-cuid-inter-pediatrico')
export class CriteriosCuidInterPediatricoController {


    constructor(
        private readonly criteriosCuidInterPediatricoService: CriteriosCuidInterPediatricoService) { }


    //OBTENER CRITERIO CUIDADO INTERMEDIO PEDIATRICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosCuidInterPediatricoService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosCuidInterPediatricoService.getall();
    }

    //CREAR CRITERIO CUIDADO INTERMEDIO PEDIATRICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntermPediatricoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosCuidInterPediatricoService.create(id, payload);
    }

    //ELIMINAR CRITERIO CUIDADO  INTERMEDIO PEDIATRICO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosCuidInterPediatricoService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO CUIDADO INTENSIVO PEDIATRICO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntermPediatricoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosCuidInterPediatricoService.update(id, payload);
    }
}
