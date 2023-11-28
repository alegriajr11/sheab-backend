import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ServiciosVerificadosService } from './servicios_verificados.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ServiciosVerificadosDto } from 'src/resolucion/dtos/servicios_capacidad_dto/servicios_verificados.dto';
import { RolesGuard } from 'src/guards/rol.guard';

@Controller('servicios-verificados')
export class ServiciosVerificadosController {

    constructor(private readonly servicios_Verificados_Service: ServiciosVerificadosService) { }
    
    //OBTENER LOS SERVICIOS VERIFICADOS POR PRESTADOR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: string) {
        return await this.servicios_Verificados_Service.getServicioForPrestador(id)
    }

    //CREAR SERVICIOS VERIFICADOS
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: string, @Body() dto: ServiciosVerificadosDto) {
        return this.servicios_Verificados_Service.create(id, dto);
    }

    //ELIMINAR CAPACIDAD INSTALADA
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.servicios_Verificados_Service.delete(id);
    }

    //ACTUALIZAR UNA CAPACIDAD INSTALADA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ServiciosVerificadosDto) {
        return await this.servicios_Verificados_Service.updateservico(id, dto);
    }
}
