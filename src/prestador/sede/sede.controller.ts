import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SedeService } from './sede.service';
import { SedeDto } from '../dto/sede.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('sede')
export class SedeController {

    constructor(
        private readonly sedeService: SedeService
    ) { }


    //OBTENER TODAS LAS SEDES
    //@UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.sedeService.getallSedes();
    }

    //@UseGuards(JwtAuthGuard)
    @Get('nombre/sede')
    async getAudtioriaNomApe(@Query('sede_nombre') sede_nombre: string) {
        return await this.sedeService.findByNombreSede(sede_nombre);
    }

    //FILTRAR SEDE POR ID DE PRESTADOR
    @UseGuards(JwtAuthGuard)
    @Get('nombre/sede/prestador/:id')
    async getManySedePrestador(@Param('id') id: string) {
        return await this.sedeService.findBySedePrestador(id);
    }


    @Get('nombre/sede/prestador/principal/:id')
    async getSedePrincipal(@Param('id') id: string) {
        return await this.sedeService.findBySedePrestadorNumero(id);
    }

    @Get(':id')
    async getManySede(@Param('id') id: number) {
        return await this.sedeService.findByIdSede(id);
    }


    //CREAR SEDE
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    async create(@Body() dto: SedeDto) {
        return this.sedeService.create(dto);
    }

    //ELIMINAR CRITERIO  PRETRANSFUNSIONAL
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.sedeService.delete(id);
    }


    //ACTUALIZAR UN CRITERIO PRETRANSFUNSIONAL
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: SedeDto) {
        return await this.sedeService.updateSede(id, dto);
    }
}
