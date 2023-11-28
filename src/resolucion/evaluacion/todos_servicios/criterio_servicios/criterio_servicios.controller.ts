import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioServiciosService } from './criterio_servicios.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioServiciosDto } from 'src/resolucion/dtos/evaluacion_dtos/todos_servicios_dto/servicios_dto/criterio_servicios.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterio-servicios')
export class CriterioServiciosController {

    constructor(
        private readonly criterioServiciosService: CriterioServiciosService) { }

    //OBTENER ESTANDARES DE TODOS LOS SERVICIOS
    //@UseGuards(JwtAuthGuard)
    @Get('estandar')
    getAllEstandar() {
        return this.criterioServiciosService.getAllEstandarServicios();
    }
    
    //LISTAR TODOS CRITERIOS
    //@UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterioServiciosService.getall();
    }

    //OBTENER CRITERIO TODOS LOS SERVICIOS POR ESTANDAR
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioServiciosService.getCriterioForEstandar(id)
    }


    //CREAR CRITERIO TODOS LOS SERVICIOS POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioServiciosDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioServiciosService.create(id, payload);
    }

    //ELIMINAR CRITERIO TODOS LOS SERVICIOS
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterioServiciosService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO TODOS LOS SERVICIOS
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioServiciosDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterioServiciosService.update(id, payload);
    }
}
