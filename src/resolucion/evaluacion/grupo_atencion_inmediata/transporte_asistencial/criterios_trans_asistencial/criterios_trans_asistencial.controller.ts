import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosTransAsistencialService } from './criterios_trans_asistencial.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioTranspAsistencialDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/transporte_asistencial_dto/criterio_trans_asistencial.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-trans-asistencial')
export class CriteriosTransAsistencialController {

    constructor(
        private readonly criteriosTransAsistencialService: CriteriosTransAsistencialService) { }

    //OBTENER CRITERIO TRASNPORTE ASISTENCIAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosTransAsistencialService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosTransAsistencialService.getall();
    }

    //CREAR CRITERIO TRANSPORTE ASISTENCIAL POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioTranspAsistencialDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosTransAsistencialService.create(id, payload);
    }

    //ELIMINAR CRITERIO  TRANSPORTE ASISTENCIAL 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosTransAsistencialService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO  TRANSPORTE ASISTENCIAL 
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioTranspAsistencialDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosTransAsistencialService.update(id, payload);
    }
}
