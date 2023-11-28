import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioMedicinaNuclearService } from './criterio_medicina_nuclear.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioMedicinaNuclearDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/medicina_nuclear_dto/criterio_medicina_nuclear.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterio-medicina-nuclear')
export class CriterioMedicinaNuclearController {

    constructor(
        private readonly criterioMedicinaNuclearService: CriterioMedicinaNuclearService) { }

    //OBTENER CRITERIO MEDICINA NUCLEAR POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioMedicinaNuclearService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioMedicinaNuclearService.getall();
    }

    //CREAR CRITERIO MEDICINA NUCLEAR POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioMedicinaNuclearDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioMedicinaNuclearService.create(id, payload);
    }

    //ELIMINAR CRITERIO  MEDICINA NUCLEAR 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioMedicinaNuclearService.delete(id, tokenDto);
    }


    //ACTUALIZAR UN CRITERIO   MEDICINA NUCLEAR 
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioMedicinaNuclearDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioMedicinaNuclearService.update(id, payload);
    }
}
