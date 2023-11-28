import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosExtGeneralService } from './criterios_ext_general.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioExternaGeneralDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/externa_general_dto/criterio_ext_general.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-ext-general')
export class CriteriosExtGeneralController {

    constructor(
        private readonly criteriosExtGeneralService: CriteriosExtGeneralService) { }

    //OBTENER CRITERIO EXTERNA GENERAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosExtGeneralService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosExtGeneralService.getall();
    }

    //CREAR CRITERIO EXTERNA GENERAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioExternaGeneralDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosExtGeneralService.create(id, payload);
    }

    //ELIMINAR CRITERIO EXTERNA GENERAL 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosExtGeneralService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO  EXTERNA GENERAL
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioExternaGeneralDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosExtGeneralService.update(id, payload);
    }
}
