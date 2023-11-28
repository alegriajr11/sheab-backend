import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosConsPsicoactivasService } from './criterios_cons_psicoactivas.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioConsumoPsicoactivasDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_basico_consumo_psicoactivas_dto/criterio_cuid_cons_psicoact.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-cons-psicoactivas')
export class CriteriosConsPsicoactivasController {

    constructor(
        private readonly criteriosConsPsicoactivasService: CriteriosConsPsicoactivasService) { }

    //OBTENER CRITERIO CUIDADO BASICO PSICOACTIVAS POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosConsPsicoactivasService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosConsPsicoactivasService.getall();
    }

    //CREAR CRITERIO CUIDADO BASICO PSICOACTIVAS POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioConsumoPsicoactivasDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosConsPsicoactivasService.create(id, payload);
    }


    //ELIMINAR CRITERIO CUIDADO BASICO PSICOACTIVAS
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosConsPsicoactivasService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO CUIDADO BASICO PSICOACTIVAS
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioConsumoPsicoactivasDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosConsPsicoactivasService.update(id, payload);
    }
}