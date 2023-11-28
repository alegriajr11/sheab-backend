import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join, resolve } from 'path';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { PrestadorRepository } from 'src/prestador/prestador.repository';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioRepository } from 'src/usuario/usuario.repository';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CriteriosicCumplimientoService } from 'src/sic/criteriosic-cumplimiento/criteriosic-cumplimiento.service';
import { CriterioindService } from 'src/sp/sp_ind/criterioind/criterioind.service';
import { CriteriopamService } from 'src/pamec/actividad/criteriopam/criteriopam.service';
import { SpIndService } from 'src/sp/sp_ind/sp_ind.service';



const PDFDocument = require('pdfkit-table')





@Injectable()
export class GenerarpdfService {



    constructor(
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: UsuarioRepository,
        @Inject(UsuarioService)
        private readonly usuarioService: UsuarioService,
        @Inject(CriteriosicCumplimientoService)
        private readonly cumplimientoService: CriteriosicCumplimientoService,
        @Inject(CriterioindService)
        private readonly criterioindService: CriterioindService,
        @Inject(CriteriopamService)
        private readonly criteriopamService: CriteriopamService,
        @Inject(SpIndService)
        private readonly spIndService: SpIndService,


    ) { }

    //GENERACIÓN DE REPORTE DE USUSARIOS CON SU RESPECTIVO ROL Y MOSTRANDO SU ESTADO
    async generarPdfUsuarios(): Promise<Buffer> {
        const usuario = await this.usuarioService.getall()

        const pdfBuffer: Buffer = await new Promise(resolve => {

            const doc = new PDFDocument(
                {
                    size: "LETTER",
                    bufferPages: true,
                    autoFirstPage: false,
                })

            let pageNumber = 0;
            doc.on('pageAdded', () => {
                pageNumber++
                let bottom = doc.page.margins.bottom;

                const logo_secretaria = "src/uploads/encabezados/logoSecretaria.png"
                const logo_gobernacion = "src/uploads/encabezados/logoGobernacion.png"

                doc.image(join(process.cwd(), logo_secretaria), doc.page.width - 160, 10, { fit: [120, 70], align: 'center' })
                doc.image(join(process.cwd(), logo_gobernacion), doc.page.width - 575, 1, { fit: [110, 50], align: 'center' })
                doc.font("Helvetica-Bold").fontSize(5);
                doc.text('NIT. 800.094.164-4', doc.page.width - 540, 50.5, { align: 'left' })

                doc.moveDown()
                doc.moveTo(50, 55)
                    .lineTo(doc.page.width - 50, 55)
                    .stroke();

                doc.page.margins.bottom = 0;
                doc.font("Helvetica").fontSize(14);
                doc.text(
                    'Pág. ' + pageNumber,
                    0.5 * (doc.page.width - 100),
                    doc.page.height - 50,
                    {
                        width: 100,
                        align: 'center',
                        lineBreak: false,
                    })
                doc.page.margins.bottom = bottom;
            })


            doc.addPage();
            doc.text('', 50, 70);
            doc.font("Helvetica-Bold").fontSize(20);
            doc.text("Lista de Usuarios SOGCS");
            doc.moveDown();
            doc.font("Helvetica").fontSize(16);
            doc.text('', 50, 70)

            const date = new Date();
            doc.fontSize(10).text(date.toLocaleDateString().toString(), {
                width: doc.page.width - 100,
                align: 'right'
            })

            doc.moveDown();
            doc.text('', 50, 70)
            doc.fontSize(24);
            doc.moveDown();
            doc.moveDown();
            doc.font("Helvetica-Bold").fontSize(16);
            doc.text("USUARIOS", {
                width: doc.page.width - 100,
                align: 'center'
            });
            doc.moveDown();


            let rows_elements = [];
            usuario.forEach(item => {
                if (item.usu_estado === 'true') {
                    item.usu_estado = 'Activo'
                } else if (item.usu_estado === 'false') {
                    item.usu_estado = 'Inactivo'
                }
                let roles = item.roles.map(rol => {
                    return rol.rol_nombre === 'res' ? 'resolución 3100' : rol.rol_nombre;
                }).join(', '); // Concatena los nombres de los roles


                var temp_list = [item.usu_nombre, item.usu_apellido, item.usu_email, item.usu_nombreUsuario, item.usu_estado, roles];
                rows_elements.push(temp_list);
            });

            const table = {
                headers: ["Nombres", "Apellidos", "Email", "Nombre de Usuario", "Estado", "Rol"],
                rows: rows_elements
            };


            doc.table(table, {
                columnsSize: [100, 100, 120, 100, 50, 50],
            });
            doc.moveDown();

            const buffer = []
            doc.on('data', buffer.push.bind(buffer))
            doc.on('end', () => {
                const data = Buffer.concat(buffer)
                resolve(data)
            })

            doc.end()


        })


        return pdfBuffer;

    }
    // FIN DEL METODO - GENERACIÓN DE REPORTE DE USUSARIOS CON SU RESPECTIVO ROL Y MOSTRANDO SU ESTADO


}
