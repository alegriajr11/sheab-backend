import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosCuidBasicNeonatalService } from './criterios_cuid_basic_neonatal.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioCuidBasNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_basico_neonatal_dto/criterio_cuid_basic_neonatal.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-cuid-basic-neonatal')
export class CriteriosCuidBasicNeonatalController {

    constructor(
        private readonly criteriosCuidBasicNeonatalService: CriteriosCuidBasicNeonatalService) { }


    //OBTENER CRITERIO CUIDADO BASICO NEONATAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosCuidBasicNeonatalService.getCriterioForEstandar(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosCuidBasicNeonatalService.getall();
    }


    //CREAR CRITERIO CUIDADO BASICO NEO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidBasNeonatalDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosCuidBasicNeonatalService.create(id, payload);
    }

    //ELIMINAR CRITERIO CUIDADO BASICO NEO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosCuidBasicNeonatalService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO CUIDADO BASICO NEO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidBasNeonatalDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosCuidBasicNeonatalService.update(id, payload);
    }
}
