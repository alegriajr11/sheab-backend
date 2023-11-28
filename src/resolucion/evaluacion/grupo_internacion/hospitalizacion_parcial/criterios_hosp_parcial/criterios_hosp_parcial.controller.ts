import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosHospParcialService } from './criterios_hosp_parcial.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioHospitalizacionParcialDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_parcial_dto/criterio_hosp_parcial.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-hosp-parcial')
export class CriteriosHospParcialController {

    constructor(
        private readonly criteriosHospParcialService: CriteriosHospParcialService) { }

    //OBTENER CRITERIO HOSPITALIZACION PARCIAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosHospParcialService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosHospParcialService.getall();
    }

    //CREAR CRITERIO HOSPITALIZACION PARCIAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHospitalizacionParcialDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosHospParcialService.create(id, payload);
    }

    //ELIMINAR CRITERIO HOSPITALIZACION PARCIAL
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosHospParcialService.delete(id, tokenDto);
    }


    //ACTUALIZAR UN CRITERIO HOSPITALIZACION PARCIAL
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHospitalizacionParcialDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosHospParcialService.update(id, payload);
    }
}
