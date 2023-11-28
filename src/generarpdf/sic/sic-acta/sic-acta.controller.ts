import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SicActaService } from './sic-acta.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ActaSicPdfDto } from '../dto/sic-acta-pdf.dto';
import { ActaSicPdfEntity } from './sic-acta-pdf.entity';
import { query } from 'express';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('sic-acta')
export class SicActaController {


    constructor(private readonly sic_act_pdfService: SicActaService) { }

    //OBTENER TODOS LOS CRITERIOS SIC
    //@UseGuards(JwtAuthGuard)
    @Get('lista/acta/funcionario/login/sic/acta')
    getAll(@Query('tokenDto') tokenDto: string ) {
        return this.sic_act_pdfService.getallActas(tokenDto);
    }

    //OBTENER ACTA POR ID
    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.sic_act_pdfService.findByActa(id);
    }

    //OBTENER ACTAS POR FECHA
    @Get('/fecha/:date')
    async findAllFromDate(@Param('date') dateString: string) {
        return this.sic_act_pdfService.findAllFromDate(dateString);
    }

    //OBTENER ACTAS POR AÑO Y/O NUMERO DE ACTA Y/O NOMBRE PRESTADOR Y/O NIT
    @Get('/busqueda/fecha/acta/prestador/nit')
    async findAllBusqueda(@Query('year') year: number,
        @Query('acta_id') acta_id: string,
        @Query('act_prestador') act_prestador: string,
        @Query('act_nit') act_nit: string,
        @Query('tokenDto') tokenDto: string) {
        const numericActaId = parseInt(acta_id);
        return this.sic_act_pdfService.findAllBusqueda(year, numericActaId, act_prestador, act_nit, tokenDto);
    }

    //ÚLTIMA ACTA SIC
    @UseGuards(JwtAuthGuard)
    @Get('ultima/acta/sic')
    getLastActa() {
        return this.sic_act_pdfService.getLastestActa();
    }

    //ÚLTIMA ACTA SIC PRIMARY KEY
    //@UseGuards(JwtAuthGuard)
    @Get('ultima/acta/sic/pk')
    getLastActaPk() {
        return this.sic_act_pdfService.ultimaActaIdPk();
    }

    //CREAR ACTA
    @Post()
    async create(@Body() payload: { dto: ActaSicPdfDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.sic_act_pdfService.create(payload);
    }



    //ACTUALIZAR ACTA-SIC PDF
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: ActaSicPdfDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.sic_act_pdfService.updateActa(id, payload);
    }

    //CERRAR ACTA SIC
    @Put('cerrar/:id')
    async cerrarActa(
        @Param('id', ParseIntPipe) id: number, @Body() payload: { tokenDto: TokenDto }) {
        return this.sic_act_pdfService.cerrarActa(id, payload);
    }

    @Get('evaluacion/:id')
    async descargarPdfCriterioInd(@Param('id') id: number, @Res() res): Promise<void> {
        const buffer = await this.sic_act_pdfService.generarPdfEvaluacionSic(id)

        res.setHeader('Content-Disposition', 'attachment; filename="evaluacion_sp_sic_sogcs.pdf"');
        res.set({
            'Content-Length': buffer.length,
        })
        res.end(buffer)
    }
}
