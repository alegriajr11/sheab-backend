/* eslint-disable prettier/prettier */
import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { MunicipioService } from './municipio.service';

@Controller('municipio')
export class MunicipioController {

    constructor(private readonly municipioService: MunicipioService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.municipioService.getall();
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.municipioService.findById(id);
    }
}
