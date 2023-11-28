import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CapacidadInstaladaService } from './capacidad_instalada.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CapacidadInstaladaDto } from 'src/resolucion/dtos/servicios_capacidad_dto/capacidad_instalada.dto';
import { RolesGuard } from 'src/guards/rol.guard';

@Controller('capacidad-instalada')
export class CapacidadInstaladaController {
    
    constructor(private readonly capacidad_Instalada_Service: CapacidadInstaladaService) { }
    
    //OBTENER LA CAPACIDAD POR PRESTADOR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: string) {
        return await this.capacidad_Instalada_Service.getServicioForPrestador(id)
    }


    //CREAR CAPACIDAD INSTALADA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: string, @Body() dto: CapacidadInstaladaDto) {
        return this.capacidad_Instalada_Service.create(id, dto);
    }

    //ELIMINAR CAPACIDAD INSTALADA
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.capacidad_Instalada_Service.delete(id);
    }

    //ACTUALIZAR UNA CAPACIDAD INSTALADA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CapacidadInstaladaDto) {
        return await this.capacidad_Instalada_Service.updateCapacidad(id, dto);
    }
}
