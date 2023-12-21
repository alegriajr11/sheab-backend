import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CumplimientoServiciosDto } from 'src/resolucion/dtos/evaluacion_dtos/todos_servicios_dto/servicios_dto/cumplimiento_servicios.dto';
import { CumplimientoTodosServiciosService } from './cumplimiento_todos_servicios.service';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('cumplimiento-todos-servicios')
export class CumplimientoTodosServiciosController {

    constructor(private readonly cumplimientoTodosServiciosService: CumplimientoTodosServiciosService) { }

    //OBTENER UN CUMPLIMIENTO POR ID CRITERIO y ID EVALUACION
    //@UseGuards(JwtAuthGuard)
    @Get()
    async getOneCriterioEvaluacion(@Query('cris_id') cris_id: number,
        @Query('eva_id') eva_id: number) {
        return await this.cumplimientoTodosServiciosService.getCumplimientoCriterioByEvaluacion(cris_id, eva_id)
    }


    //CREAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    async create(@Body() payload: { dto: CumplimientoServiciosDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.cumplimientoTodosServiciosService.create(payload);
    }

    //ELIMINAR CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoTodosServiciosService.delete(id);
    }

    //ACTUALIZAR UN CUMPLIMIENTO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payloads: { dto: CumplimientoServiciosDto, tokenDto: TokenDto}) {
        const { dto, tokenDto } = payloads;
        return await this.cumplimientoTodosServiciosService.updateCumplimiento(id, payloads);
    }

    //OBTENER LOS CUMPLIMIENTOS POR EVALUACION
    // @UseGuards(JwtAuthGuard)
    @Get('/cumplimientos/evaluacion/:id')
    async getCumplimientoForEva(@Param('id', ParseIntPipe) id: number) {
        return await this.cumplimientoTodosServiciosService.getCumplimientoForEva(id)
    }
}
