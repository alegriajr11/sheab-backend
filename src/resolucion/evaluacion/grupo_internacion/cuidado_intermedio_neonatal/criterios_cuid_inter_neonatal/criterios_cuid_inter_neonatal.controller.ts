import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosCuidInterNeonatalService } from './criterios_cuid_inter_neonatal.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioCuidIntermNeonatalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_intermedio_neonatal_dto/criterio_cuid_inter_neonatal.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-cuid-inter-neonatal')
export class CriteriosCuidInterNeonatalController {

    constructor(
        private readonly criteriosCuidInterNeonatalService: CriteriosCuidInterNeonatalService) { }


    //OBTENER CRITERIO CUIDADO INTERMEDIO NEONATAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosCuidInterNeonatalService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosCuidInterNeonatalService.getall();
    }


    //CREAR CRITERIO CUIDADO INTERMEDIO NEONATAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntermNeonatalDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosCuidInterNeonatalService.create(id, payload);
    }

    //ELIMINAR CRITERIO CUIDADO  INTERMEDIO NEONATAL
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosCuidInterNeonatalService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO CUIDADO INTERMEDIO NEONATAL
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioCuidIntermNeonatalDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosCuidInterNeonatalService.update(id, payload);
    }
}
