import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioSFarmaceuticoService } from './criterio_s_farmaceutico.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioSerFarmaceuticoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/servicio_farmaceutico_dto/criterios_s_farmaceutico.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterio-s-farmaceutico')
export class CriterioSFarmaceuticoController {


    constructor(
        private readonly criterioSFarmaceuticoService: CriterioSFarmaceuticoService) { }

    //OBTENER CRITERIO SERVICIO FARMACEUTICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioSFarmaceuticoService.getCriterioForEstandar(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioSFarmaceuticoService.getall();
    }

    //CREAR CRITERIO SERVICIO FARMACEUTICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioSerFarmaceuticoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioSFarmaceuticoService.create(id, payload);
    }

    //ELIMINAR CRITERIO  SERVICIO FARMACEUTICO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioSFarmaceuticoService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO   SERVICIO FARMACEUTICO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioSerFarmaceuticoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioSFarmaceuticoService.update(id, payload);
    }
}
