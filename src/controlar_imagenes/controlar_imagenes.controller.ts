import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

import * as path from 'path'; // Importa la librería 'path' para manejar rutas de archivos


@Controller('controlar-imagenes')
export class ControlarImagenesController {

    constructor(private readonly configService: ConfigService) {}



    @Get('uploads/sp_ips/:actaId/:imageFileName')
    serveImage(
        @Param('actaId') actaId: string,
        @Param('imageFileName') imageFileName: string,
        @Res() res: Response,
    ): void {

        const sanitizedFileName = imageFileName.replace(/\s/g, ''); // Reemplazar saltos con vacio
        const imagePath = path.join(this.configService.get<string>('IMAGE_PATH'), actaId, sanitizedFileName);
        res.sendFile(imagePath);
    }
}




