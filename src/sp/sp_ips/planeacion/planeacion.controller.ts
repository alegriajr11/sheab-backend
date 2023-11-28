import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioPlaneacionDto } from 'src/usuario/dto/SpIps/criterioplaneacion.dto';
import { PlaneacionService } from './planeacion.service';

@Controller('planeacion')
export class PlaneacionController {

    constructor(private readonly criterioPlaneacionService: PlaneacionService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.criterioPlaneacionService.findByEva(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioPlaneacionService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/criterio/:id')
    async getOneAjuste(@Param('id', ParseIntPipe) id: number){
        return await this.criterioPlaneacionService.findByCri(id);
    }


    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({whitelist: true, transformOptions: {enableImplicitConversion: true}}))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioPlaneacionDto){
        return await this.criterioPlaneacionService.update(id, dto);
    }

    //creacion de criterio
    //@UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({whitelist: true, transformOptions: {enableImplicitConversion: true}}))
    @Post('criterio/:id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioPlaneacionDto){
        return await this.criterioPlaneacionService.create(id, dto);
    }
}
