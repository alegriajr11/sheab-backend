import { Controller, Get, Res } from '@nestjs/common';
import { GenerarExcelService } from './generar_excel.service';
import * as fs from 'fs';


@Controller('generar-excel')
export class GenerarExcelController {

    constructor(
        private readonly generarExcelService: GenerarExcelService,

    ) { }

    @Get('usuarios')
    async descargarExcel(@Res() res): Promise<void> {
        try {
            const excelBuffer = await this.generarExcelService.generarExcelUsuarios();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx');
            res.send(excelBuffer);

            res.end(excelBuffer);
        } catch (error) {
            // Handle errors here
            res.status(500).send('Internal Server Error');
        }
    }
}
