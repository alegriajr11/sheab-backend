import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioRadioOdontService } from './criterio_radio_odont.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioRadiologiaOdontoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/radiologia_odont_dto/criterio_radio_odont.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterio-radio-odont')
export class CriterioRadioOdontController {

    constructor(
        private readonly criterioRadioOdontService: CriterioRadioOdontService) { }

    //OBTENER CRITERIO RADIOLOGIA ODONTO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioRadioOdontService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioRadioOdontService.getall();
    }

    //CREAR CRITERIO RADIOLOGIA ODONTOLOGICA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioRadiologiaOdontoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioRadioOdontService.create(id, payload);
    }

    //ELIMINAR CRITERIO  RADIOLOGIA ODONTOLOGICA
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioRadioOdontService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO   RADIOLOGIA ODONTOLOGICA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioRadiologiaOdontoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioRadioOdontService.update(id, payload);
    }
}
