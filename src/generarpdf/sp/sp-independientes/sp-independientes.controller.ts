import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SpIndependientesService } from './sp-independientes.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { IndActaDto } from 'src/generarpdf/sp/dto/sp-ind-acta.dto';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('sp-independientes')
export class SpIndependientesController {

    constructor(private readonly sp_IndependientesService: SpIndependientesService) { }

    //OBTENER TODOS LAS ACTAS SP INDEPENDIENTE
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(@Query('tokenDto') tokenDto: string) {
        return this.sp_IndependientesService.getallActas(tokenDto);
    }

    //OBTENER UN SP INDEPENDIENTE ACTA PDF POR ID
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.sp_IndependientesService.findByActa(id);
    }

    //OBTENER ACTAS POR FECHA
    @Get('/fecha/:date')
    async findAllFromDate(@Param('date') dateString: string) {
        return this.sp_IndependientesService.findAllFromDate(dateString);
    }


    //OBTENER ACTAS POR AÑO Y/O NUMERO DE ACTA Y/O NOMBRE PRESTADOR Y/O NIT
    @Get('/busqueda/fecha/acta/prestador/nit')
    async findAllBusqueda(@Query('year') year: number,
        @Query('acta_id') act_id: number,
        @Query('act_prestador') act_prestador: string,
        @Query('act_nit') act_nit: string,
        @Query('tokenDto') tokenDto: string) {
        return this.sp_IndependientesService.findAllBusqueda(year, act_id, act_prestador, act_nit, tokenDto);
    }

    //CREAR SP INDEPENDIENTE ACTA PDF
    @Post()
    async create(@Body() payload: { dto: IndActaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.sp_IndependientesService.create(payload);
    }

    //ACTUALIZAR  SP INDEPENDIENTE ACTA PDF
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: IndActaDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.sp_IndependientesService.updateActaInd(id, payload);
    }

    //@UseGuards(JwtAuthGuard)
    @Get('ultima/acta/spind')
    getLastActa() {
        return this.sp_IndependientesService.getLastestActa();
    }

    //CERRAR ACTA SP-IND
    @Put('cerrar/:id')
    async cerrarActa(
        @Param('id', ParseIntPipe) id: number, @Body() payload: { tokenDto: TokenDto }) {
        return this.sp_IndependientesService.cerrarActa(id, payload);
    }

    @Get('sp/ind/evaluacion/:id')
    async descargarPdfCriterioInd(@Param('id') id: number, @Res() res): Promise<void> {
        const buffer = await this.sp_IndependientesService.generarPdfEvaluacionInd(id)

        res.setHeader('Content-Disposition', 'attachment; filename="evaluacion_sp_ind_sogcs.pdf"');
        res.set({
            'Content-Length': buffer.length,
        })
        res.end(buffer)
    }
}
