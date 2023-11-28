import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriterioDiagnostVascularService } from './criterio_diagnost_vascular.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioDiagnostVascularDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/diagnostico_vascular_dto/criterio_diagnostico_vascular.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';



@Controller('criterio-diagnost-vascular')
export class CriterioDiagnostVascularController {

    constructor(private readonly criterio_Diagnostico_vascularService: CriterioDiagnostVascularService) { }
    //OBTENER CRITERIO DIAGNOSTICO VASCULAR POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterio_Diagnostico_vascularService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criterio_Diagnostico_vascularService.getall();
    }

    //CREAR CRITERIO DIAGNOSTICO VASCULAR POR ESTANDAR
    //@UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioDiagnostVascularDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterio_Diagnostico_vascularService.createCriDiag(id, payload);
    }

    //ELIMINAR CRITERIO  DIAGNOSTICO VASCULAR
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criterio_Diagnostico_vascularService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO DIAGNOSTICO VASCULAR
    //@UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioDiagnostVascularDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criterio_Diagnostico_vascularService.updateVascular(id, payload);
    }
}
