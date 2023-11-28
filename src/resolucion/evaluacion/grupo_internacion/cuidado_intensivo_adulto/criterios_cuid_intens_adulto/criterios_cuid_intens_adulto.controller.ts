import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosCuidIntensAdultoService } from './criterios_cuid_intens_adulto.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioCuidIntensAdultoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intensivo_adulto_dto/criterio_cuid_intens_adulto.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-cuid-intens-adulto')
export class CriteriosCuidIntensAdultoController {

    constructor(
        private readonly criteriosCuidIntensAdultoService: CriteriosCuidIntensAdultoService) { }


    //OBTENER CRITERIO CUIDADO INTENSIVO ADULTO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosCuidIntensAdultoService.getCriterioForEstandar(id)
    }
    
    //LISTAR TODOS LOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosCuidIntensAdultoService.getall();
    }


    //CREAR CRITERIO CUIDADO INTENSIVO ADULTO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntensAdultoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosCuidIntensAdultoService.create(id, payload);
    }

    //ELIMINAR CRITERIO CUIDADO INTENSIVO ADULTO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosCuidIntensAdultoService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO CUIDADO INTENSIVO ADULTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntensAdultoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosCuidIntensAdultoService.update(id, payload);
    }
}
