import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosDialisisService } from './criterios_dialisis.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioDialisisDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/dialisis_dto/criterio_dialisis.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-dialisis')
export class CriteriosDialisisController {

    constructor(private readonly criterioDialisisService: CriteriosDialisisService) { }


    //OBTENER CRITERIO DIALISIS POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioDialisisService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioDialisisService.getall();
    }


    //CREAR CRITERIO DIALISIS POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioDialisisDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioDialisisService.createCriDialisis(id, payload);
    }


    //ELIMINAR CRITERIO DIALISIS
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioDialisisService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO DIALISIS
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioDialisisDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioDialisisService.updateDialisis(id, payload);
    }

}
