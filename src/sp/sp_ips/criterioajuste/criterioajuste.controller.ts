import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioAjusteDto } from 'src/usuario/dto/SpIps/criterioajuste.dto';
import { CriterioajusteService } from './criterioajuste.service';

@Controller('criterioajuste')
export class CriterioajusteController {

    
    constructor(private readonly criterioAjusteService: CriterioajusteService) {
    }

    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.criterioAjusteService.findByEva(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/ajuste/:id')
    async getOneAjuste(@Param('id', ParseIntPipe) id: number){
        return await this.criterioAjusteService.findByCri(id);
    }


    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({whitelist: true, transformOptions: {enableImplicitConversion: true}}))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioAjusteDto){
        return await this.criterioAjusteService.update(id, dto);
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioAjusteService.delete(id);
    }

     //creacion de criterio
    //@UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({whitelist: true, transformOptions: {enableImplicitConversion: true}}))
    @Post('criterio/:id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioAjusteDto){
        return await this.criterioAjusteService.create(id, dto);
    }
}
