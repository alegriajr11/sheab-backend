import { Controller } from '@nestjs/common';
import { Get, Res } from '@nestjs/common/decorators';
import { GenerarpdfService } from './generarpdf.service';



@Controller('generarpdf')
export class GenerarpdfController {

    constructor(
        private readonly generarPdfService: GenerarpdfService,

    ) { }

    //DECORADOR SOLICITANDO SERVICIO GENERAR PDF
    @Get('usuarios')
    async descargarPdf(@Res() res): Promise<void> {
        const buffer = await this.generarPdfService.generarPdfUsuarios()

        res.setHeader('Content-Disposition', 'attachment; filename="usuarios_sogcs.pdf"');
        res.set({
            'Content-Length': buffer.length,
        })
        res.end(buffer)
    }

}
