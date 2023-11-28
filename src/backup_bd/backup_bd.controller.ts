import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import mysqldump from 'mysqldump';
import * as fs from 'fs';



@Controller('backup-bd')
export class BackupBdController {

    @Get()
    async generateBackup(@Res() res: Response) {

        const connectionOptions = {
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
            },
            dumpToFile: 'backup.sql', // Nombre del archivo de respaldo
        };

        try {
            await mysqldump(connectionOptions);

            const backupContent = fs.readFileSync('backup.sql', 'utf8');

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=backup.sql');
            res.send(backupContent); // Enviar el contenido del archivo SQL como respuesta

            // Eliminar el archivo después de enviarlo
            fs.unlinkSync('backup.sql');
        } catch (error) {
            res.status(500).send('Error al generar el respaldo');
        }
    }
    
}
