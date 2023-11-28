import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioImgRadIonizantesService } from './criterio_img_rad_ionizantes.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioImgRadIonizantesDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/imagenes_diagnosticas_rad_ionizantes_dto/criterio_img_rad_ionizantes.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterio-img-rad-ionizantes')
export class CriterioImgRadIonizantesController {

    constructor(private readonly criterioImgRadIonizantesService: CriterioImgRadIonizantesService) { }

    //OBTENER CRITERIO IMAGENES IONIZANTES POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioImgRadIonizantesService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioImgRadIonizantesService.getall();
    }

    //CREAR CRITERIO IMAGENES DIAGNOSTICAS RAD IONI POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioImgRadIonizantesDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioImgRadIonizantesService.create(id, payload);
    }

    //ELIMINAR CRITERIO  IMAGENES DIAGNOSTICAS RAD IONIZANTES
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioImgRadIonizantesService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO  IMAGENES DIAGNOSTICAS RAD IONIZANTES
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioImgRadIonizantesDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioImgRadIonizantesService.updateIma_Rad(id, payload);
    }
}


