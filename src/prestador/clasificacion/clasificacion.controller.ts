/* eslint-disable prettier/prettier */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ClasificacionService } from './clasificacion.service';

@Controller('clasificacion')
export class ClasificacionController {
    constructor(private readonly clasificacionService: ClasificacionService){}

    // @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(){
        return await this.clasificacionService.getall()
    }

    @Get('one')
    async getOneClasificacion(@Query('cla_id') cla_id: number){
        return await this.clasificacionService.findById(cla_id)
    }

}
