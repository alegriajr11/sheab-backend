import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriteriosLabClinicoService } from './criterios_lab_clinico.service';
import { CriterioLabClinicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_clinico_dto/criterio_lab_clinico.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-lab-clinico')
export class CriteriosLabClinicoController {

    constructor(

        private readonly criteriosLabClinicoService: CriteriosLabClinicoService) { }

    //OBTENER CRITERIO LABORATORIO CLINICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosLabClinicoService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosLabClinicoService.getall();
    }


    //CREAR CRITERIO LABORATORIO CLINICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioLabClinicoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosLabClinicoService.create(id, payload);
    }

    //ELIMINAR CRITERIO  LAB CLINICO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosLabClinicoService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO  LAB CLINICO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioLabClinicoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosLabClinicoService.update(id, payload);
    }
}
