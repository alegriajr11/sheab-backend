import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioImplementacionDto } from 'src/usuario/dto/SpIps/criterioimple.dto';
import { CriterioimpleService } from './criterioimple.service';

@Controller('criterioimple')
export class CriterioimpleController {

    constructor(
        private readonly criterioImplementacionService: CriterioimpleService) {
    }
    

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.criterioImplementacionService.findByEva(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioImplementacionService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/implementacion/:id')
    async getOneAjuste(@Param('id', ParseIntPipe) id: number){
        return await this.criterioImplementacionService.findByCri(id);
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({whitelist: true, transformOptions: {enableImplicitConversion: true}}))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioImplementacionDto){
        return await this.criterioImplementacionService.update(id, dto);
    }

    //creacion de criterio
    //@UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({whitelist: true, transformOptions: {enableImplicitConversion: true}}))
    @Post('criterio/:id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioImplementacionDto){
        return await this.criterioImplementacionService.create(id, dto);
    }
}
