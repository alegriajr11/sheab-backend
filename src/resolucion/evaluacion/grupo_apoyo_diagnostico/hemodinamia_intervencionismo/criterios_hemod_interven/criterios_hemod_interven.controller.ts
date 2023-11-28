import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosHemodIntervenService } from './criterios_hemod_interven.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioHermodinamiaIntervenDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/hemodinamia_intervencionismo_dto/criterio_hemo_inter.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-hemod-interven')
export class CriteriosHemodIntervenController {

    constructor(private readonly criteriosHemodIntervenService: CriteriosHemodIntervenService) { }

    //OBTENER CRITERIO HEMODINAMIA POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosHemodIntervenService.getCriterioForEstandar(id)
    }

    //OBTENER TODOS LOS  CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosHemodIntervenService.getall();
    }

    //CREAR CRITERIO HEMODINAMIA INTER POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHermodinamiaIntervenDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosHemodIntervenService.create(id, payload);
    }

    //ELIMINAR CRITERIO  HEMODINAMIA
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosHemodIntervenService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO HEMODINAMIA
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHermodinamiaIntervenDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosHemodIntervenService.updateHemo(id, payload);
    }
}
