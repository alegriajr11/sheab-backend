import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosCuidInterAdultoService } from './criterios_cuid_inter_adulto.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioCuidIntermAdultoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_adulto_dto/criterio_cuid_inter_adulto.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-cuid-inter-adulto')
export class CriteriosCuidInterAdultoController {

    constructor(
        private readonly criteriosCuidInterAdultoService: CriteriosCuidInterAdultoService) { }

    //OBTENER CRITERIO CUIDADO INTERMEDIO ADULTO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosCuidInterAdultoService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosCuidInterAdultoService.getall();
    }


    //CREAR CRITERIO CUIDADO INTERMEDIO ADULTO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntermAdultoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosCuidInterAdultoService.create(id, payload);
    }

    //ELIMINAR CRITERIO CUIDADO  INTERMEDIO ADULTO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosCuidInterAdultoService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO CUIDADO INTENSIVO PEDIATRICO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntermAdultoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosCuidInterAdultoService.update(id, payload);
    }
}
