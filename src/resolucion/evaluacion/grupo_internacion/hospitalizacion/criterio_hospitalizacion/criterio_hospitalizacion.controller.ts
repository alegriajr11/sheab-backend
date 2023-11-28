import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioHospitalizacionService } from './criterio_hospitalizacion.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioHospitalizacionDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_dto/criterio_hospitalizacion.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterio-hospitalizacion')
export class CriterioHospitalizacionController {

    constructor(
        private readonly criterioHospitalizacionService: CriterioHospitalizacionService) { }

    //OBTENER CRITERIO HOSPITALIZACION POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioHospitalizacionService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioHospitalizacionService.getall();
    }

    //CREAR CRITERIO HOSPITALIZACION POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHospitalizacionDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioHospitalizacionService.create(id, payload);
    }

    //ELIMINAR CRITERIO HOSPITALIZACION
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioHospitalizacionService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO HOSPITALIZACION
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHospitalizacionDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioHospitalizacionService.update(id, payload);
    }
}
