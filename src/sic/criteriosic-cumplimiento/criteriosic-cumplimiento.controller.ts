import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CumplimientoEstandarSicDto } from 'src/usuario/dto/Sic/cumplimientoEstandar.dto';
import { CriteriosicCumplimientoService } from './criteriosic-cumplimiento.service';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criteriosic-cumplimiento')
export class CriteriosicCumplimientoController {

    constructor(
        private readonly criterioCumplimientosicService: CriteriosicCumplimientoService
    ) { }

    // @UsePipes(new ValidationPipe({ whitelist: true }))
    // @Post('estandar')
    // async create(@Body() dto: CumplimientoEstandarSicDto) {
    //     return this.criterioCumplimientosicService.createCumplimientoEstandar(dto);
    // }

    @Post()
    async create(@Body() payload: { dto: CumplimientoEstandarSicDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criterioCumplimientosicService.createCumplimientoEstandar(payload);
    }

    //LISTAR CUMPLIMIENTOS POR ID CRITERIO Y ID EVALUACION
    @Get()
    async getCumplimientoIdCE(
        @Query('crie_id') crie_id: number,
        @Query('eva_id') eva_id: number,
    ) {
        return await this.criterioCumplimientosicService.getCumplimientoId(crie_id, eva_id)
    }



    @Get('ultimo-cumplimiendo-estandar')
    async getAllCumplimientos() {
        return await this.criterioCumplimientosicService.getUltimoCumplimiento()
    }


    // @Get('cumple/:id')
    // async getAllCumple(@Param('id', ParseIntPipe) id: number) {
    //     return await this.criterioCumplimientosicService.findByIdCumpl(id);
    // }
}
