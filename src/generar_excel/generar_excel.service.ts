import { Inject, Injectable, Patch } from '@nestjs/common';
import { buffer } from 'rxjs';
import * as Excel from 'excel4node';
import { UsuarioService } from 'src/usuario/usuario.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioRepository } from 'src/usuario/usuario.repository';

@Injectable()
export class GenerarExcelService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: UsuarioRepository,
        @Inject(UsuarioService)
        private readonly usuarioService: UsuarioService
    ){}
   
    

    async generarExcelUsuarios(): Promise<Buffer> {
        const usuario = await this.usuarioService.getall();
        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet('Usuarios');
    
        // Define el estilo del encabezado
        const cualColumnaEstilo = ws.createStyle({
            font: {
                name: 'Arial',
                color: '#000000',
                size: 12,
                bold: true,
            }
        });
    
        // Crea el encabezado
        ws.cell(1, 1).string("Cedula").style(cualColumnaEstilo);
        ws.cell(1, 2).string("Apellido").style(cualColumnaEstilo);
        ws.cell(1, 3).string("Email").style(cualColumnaEstilo);
        ws.cell(1, 4).string("Cargo").style(cualColumnaEstilo);
    
        let cualFila = 2;
    
        usuario.forEach(item => {
            ws.cell(cualFila, 1).string(item.usu_cedula);
            ws.cell(cualFila, 2).string(item.usu_apellido);
            ws.cell(cualFila, 3).string(item.usu_email);
            ws.cell(cualFila, 4).string(item.usu_cargo);
            cualFila++;
        });
    
        // Genera el archivo Excel en un buffer
        const buffer = await wb.xlsx.writeBuffer();
        
        return buffer;
    }

}

