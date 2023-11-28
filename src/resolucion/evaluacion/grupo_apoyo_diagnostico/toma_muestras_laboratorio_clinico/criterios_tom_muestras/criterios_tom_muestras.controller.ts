import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosTomMuestrasService } from './criterios_tom_muestras.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioMuestraLabClinicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/toma_muestras_laboratorio_clinico_dto/criterio_tom_muestras.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-tom-muestras')
export class CriteriosTomMuestrasController {

    constructor(
        private readonly criteriosTomMuestrasService: CriteriosTomMuestrasService) { }

    //OBTENER CRITERIO TOMA MUESTRAS LABORATORIO CLINICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosTomMuestrasService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosTomMuestrasService.getall();
    }

    //CREAR CRITERIO TOMA MUESTRA LAB CLINICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioMuestraLabClinicoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosTomMuestrasService.create(id, payload);
    }

    //ELIMINAR CRITERIO  TOMA MUESTAS CUELLO UTERINO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosTomMuestrasService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO   TOMA MUESTAS CUELLO UTERINO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioMuestraLabClinicoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosTomMuestrasService.update(id, payload);
    }
}
