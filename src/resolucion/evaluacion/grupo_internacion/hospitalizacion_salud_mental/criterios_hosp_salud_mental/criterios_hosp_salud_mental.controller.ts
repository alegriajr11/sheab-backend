import { CriterioHospitalizacionMentalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_salud_mental_dto/criterio_hosp_salud_mental.dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioHospitalizacionService } from '../../hospitalizacion/criterio_hospitalizacion/criterio_hospitalizacion.service';
import { CriteriosHospSaludMentalService } from './criterios_hosp_salud_mental.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-hosp-salud-mental')
export class CriteriosHospSaludMentalController {

    constructor(
        private readonly criteriosHospSaludMentalService: CriteriosHospSaludMentalService) { }

    //OBTENER CRITERIO HOSPITALIZACION SALUD MENTAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosHospSaludMentalService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosHospSaludMentalService.getall();
    }

    //CREAR CRITERIO HOSPITALIZACION MENTAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHospitalizacionMentalDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosHospSaludMentalService.create(id, payload);
    }

    //ELIMINAR CRITERIO HOSPITALIZACION MENTAL
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosHospSaludMentalService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO HOSPITALIZACION MENTAL
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHospitalizacionMentalDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosHospSaludMentalService.update(id, payload);
    }
}

