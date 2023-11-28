import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosSaludTrabajoService } from './criterios_salud_trabajo.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioSaludTrabajoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_consulta_externa_dtos/seguridad_salud_trabajo_dto/criterios_salud_trabajo.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-salud-trabajo')
export class CriteriosSaludTrabajoController {

    constructor(
        private readonly criteriosSaludTrabajoService: CriteriosSaludTrabajoService) { }

    //OBTENER CRITERIO SEGURIDAD SALUD TRABAJO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosSaludTrabajoService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosSaludTrabajoService.getall();
    }

    //CREAR CRITERIO SEGURIDAD Y SALUD EN EL TRABAJO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioSaludTrabajoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosSaludTrabajoService.create(id, payload);
    }

    //ELIMINAR CRITERIO SEGURIDAD Y SALUD EN EL TRABAJO 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosSaludTrabajoService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO  SEGURIDAD Y SALUD EN EL TRABAJO 
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioSaludTrabajoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosSaludTrabajoService.update(id, payload);
    }
}
