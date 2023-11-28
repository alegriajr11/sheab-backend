import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ActividadService } from './actividad.service';

@Controller('actividad')
export class ActividadController {

    constructor(private readonly actividadService: ActividadService) {
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.actividadService.getall();
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.actividadService.findById(id);
    }

}
