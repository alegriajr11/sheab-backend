import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioImgRadNoionizantesService } from './criterio_img_rad_noionizantes.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioImgRadNoIonizantesDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/imagenes_diagnosticas_rad_noionizantes_dto/criterio_img_rad_noionizantes.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterio-img-rad-noionizantes')
export class CriterioImgRadNoionizantesController {

    constructor(private readonly criterioImgRadNoionizantesService: CriterioImgRadNoionizantesService) { }

    //OBTENER CRITERIO IMAGENES NOIONIZANTES POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioImgRadNoionizantesService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioImgRadNoionizantesService.getall();
    }

    //CREAR CRITERIO IMAGENES RADIO NO IONI POR ESTANDAR
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioImgRadNoIonizantesDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioImgRadNoionizantesService.create(id, payload);
    }

    
    //ELIMINAR CRITERIO  IMAGENES DIAGNOSTICAS RAD NO IONIZANTES
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioImgRadNoionizantesService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO  IMAGENES DIAGNOSTICAS RAD NO IONIZANTES
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioImgRadNoIonizantesDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioImgRadNoionizantesService.updateIma_Rad_Noio(id, payload);
    }
}
