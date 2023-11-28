import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosPrehospitalariaService } from './criterios_prehospitalaria.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioPrehospitalariaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/prehospitalaria_dto/criterio_prehospitalaria.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-prehospitalaria')
export class CriteriosPrehospitalariaController {

    constructor(
        private readonly criteriosPrehospitalariaService: CriteriosPrehospitalariaService) { }

    //OBTENER CRITERIO PREHOSPITALARIA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosPrehospitalariaService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosPrehospitalariaService.getall();
    }

    //CREAR CRITERIO PREHOSPITALARIA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioPrehospitalariaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosPrehospitalariaService.create(id, payload);
    }

    //ELIMINAR CRITERIO  PREHOSPITALARIA 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosPrehospitalariaService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO  PREHOSPITALARIA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioPrehospitalariaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosPrehospitalariaService.update(id, payload);
    }
}
