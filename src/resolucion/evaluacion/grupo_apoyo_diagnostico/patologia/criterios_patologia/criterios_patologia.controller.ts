import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosPatologiaService } from './criterios_patologia.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioPatologiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/patologia_dto/criterio_patologia.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-patologia')
export class CriteriosPatologiaController {

    constructor(
        private readonly criteriosPatologiaService: CriteriosPatologiaService) { }

    //OBTENER CRITERIO PATOLOGIA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosPatologiaService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosPatologiaService.getall();
    }

    //CREAR CRITERIO PATOLOGIA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioPatologiaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosPatologiaService.create(id, payload);
    }

    //ELIMINAR CRITERIO  PATOLOGIA
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosPatologiaService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO   PATOLOGIA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioPatologiaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosPatologiaService.update(id, payload);
    }
}
