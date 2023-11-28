import { Controller } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioVerificacionDto } from 'src/usuario/dto/SpIps/criterioverificacion.dto';
import { CriterioverifService } from './criterioverif.service';

@Controller('criterioverif')
export class CriterioverifController {

    constructor(private readonly criterioVerificacionService: CriterioverifService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.criterioVerificacionService.findByEva(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/verificacion/:id')
    async getOneAjuste(@Param('id', ParseIntPipe) id: number){
        return await this.criterioVerificacionService.findByCri(id);
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({whitelist: true, transformOptions: {enableImplicitConversion: true}}))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioVerificacionDto){
        return await this.criterioVerificacionService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioVerificacionService.delete(id);
    }

    //creacion de criterio
    //@UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({whitelist: true, transformOptions: {enableImplicitConversion: true}}))
    @Post('criterio/:id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioVerificacionDto){
        return await this.criterioVerificacionService.create(id, dto);
    }
}

