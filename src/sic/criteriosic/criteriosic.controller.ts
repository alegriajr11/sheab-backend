import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/rol.guard';
import { CriterioEstandarDto } from 'src/usuario/dto/Sic/criterioEstandar.dto';
import { CriterioSicDto } from 'src/usuario/dto/Sic/criteriosic.dto';
import { CriteriosicService } from './criteriosic.service';

@Controller('criteriosic')
export class CriteriosicController {

    constructor(private readonly criteriosicService: CriteriosicService) {
    }

    //LISTAR DOMINIOS
    @UseGuards(JwtAuthGuard)
    @Get('dominios')
    getAllDom() {
        return this.criteriosicService.getall();
    }

    /*CRITERIOS SIC*/
    //CREAR CRITERIO SIC
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    async create(@Body() dto: CriterioSicDto) {
        return this.criteriosicService.crearCriterioSic(dto);
    }

    //ELIMINAR CRITERIO SIC
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosicService.delete(id);
    }

    //OBTENER TODOS LOS CRITERIOS SIC
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosicService.getallCriterioSic();
    }

    //OBTENER CRITERIO SIC POR ID
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosicService.findByIdSic(id);
    }

    //ACTUALIZAR UN CRITERIO SIC
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioSicDto) {
        return await this.criteriosicService.updatesic(id, dto);
    }



    /*CRITERIOS SIC ESTANDAR*/
    //OBTENER TODOS LOS CRITERIOS ESTANDAR
    @Get('estandar/criterios')
    getEstandarall() {
        return this.criteriosicService.criterioEstandarAll();
    }

    //OBTENER CRITERIO SIC POR ID
    @Get('estandar/:id')
    async getOneCriterioEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosicService.findByIdEstandarSic(id);
    }

    //CREAR CRITERIO SIC ESTANDAR
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('estandar')
    async createEstandar(@Body() dto: CriterioEstandarDto) {
        return this.criteriosicService.crearCriterioEstandar(dto);
    }

    //ELIMINAR CRITERIO ESTANDAR SIC
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('estandar/:id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosicService.deleteEstandar(id);
    }


}
