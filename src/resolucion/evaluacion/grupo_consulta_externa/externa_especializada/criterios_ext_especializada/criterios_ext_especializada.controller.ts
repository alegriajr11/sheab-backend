import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosExtEspecializadaService } from './criterios_ext_especializada.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioEspecializadaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/externa_especializada_dto/criterio_especializada.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-ext-especializada')
export class CriteriosExtEspecializadaController {


    constructor(
        private readonly criteriosExtEspecializadaService: CriteriosExtEspecializadaService) { }

    //OBTENER CRITERIO CONSULTA EXTERNA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosExtEspecializadaService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosExtEspecializadaService.getall();
    }

    //CREAR CRITERIO EXTERNA ESPECIALIZADA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioEspecializadaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosExtEspecializadaService.create(id, payload);
    }

    //ELIMINAR CRITERIO  EXTERNA ESPECIALIZADA 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosExtEspecializadaService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO  EXTERNA ESPECIALIZADA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioEspecializadaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosExtEspecializadaService.update(id, payload);
    }
}
