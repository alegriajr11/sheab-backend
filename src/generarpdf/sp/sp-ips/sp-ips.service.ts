import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActaSpIpsEntity } from './sp-ips.entity';
import { ActaSpIpsRepository } from './sp-ips.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { IpsDto } from 'src/generarpdf/sp/dto/sp-ips.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { EvaluacionIpsRepository } from 'src/sp/sp_ips/evaluacionips.repository';
import { EvaluacionipsEntity } from 'src/sp/sp_ips/evaluacionips.entity';
import { join } from 'path';
import { CalificacionipsAjusteService } from 'src/sp/sp_ips/calificacion/calificacionips_ajuste/calificacionips_ajuste.service';
import { CalificacionipsImplementacionService } from 'src/sp/sp_ips/calificacion/calificacionips_implementacion/calificacionips_implementacion.service';
import { CalificacionipsPlaneacionService } from 'src/sp/sp_ips/calificacion/calificacionips_planeacion/calificacionips_planeacion.service';
import { CalificacionipsVerificacionService } from 'src/sp/sp_ips/calificacion/calificacionips_verificacion/calificacionips_verificacion.service';
import * as fs from 'fs';
import * as path from 'path';


const PDFDocument = require('pdfkit-table')

const UPLOADS_PATH = './src/uploads/sp_ips'; // Ruta relativa al archivo actual


@Injectable()
export class SpIpsService {
    constructor(
        @InjectRepository(ActaSpIpsEntity)
        private readonly actaSpIpsRepository: ActaSpIpsRepository,
        @InjectRepository(EvaluacionipsEntity)
        private readonly evaluacionesIps: EvaluacionIpsRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_service: AuditoriaActualizacionService,
        @Inject(CalificacionipsAjusteService)
        private readonly calificacionipsAjusteService: CalificacionipsAjusteService,
        @Inject(CalificacionipsImplementacionService)
        private readonly calificacionipsImplementacionService: CalificacionipsImplementacionService,
        @Inject(CalificacionipsPlaneacionService)
        private readonly calificacionipsPlaneacionService: CalificacionipsPlaneacionService,
        @Inject(CalificacionipsVerificacionService)
        private readonly calificacionipsVerificacionService: CalificacionipsVerificacionService,

    ) { }

    //LISTAR TODAS LAS ACTAS SP IPS
    async getallActas(tokenDto: string): Promise<ActaSpIpsEntity[]> {
        const usuario = await this.jwtService.decode(tokenDto);
        const payloadInterface: PayloadInterface = {
            usu_id: usuario[`usu_id`],
            usu_nombre: usuario[`usu_nombre`],
            usu_apellido: usuario[`usu_apellido`],
            usu_nombreUsuario: usuario[`usu_nombreUsuario`],
            usu_email: usuario[`usu_email`],
            usu_estado: usuario[`usu_estado`],
            usu_roles: usuario[`usu_roles`]
        };
        if (!payloadInterface.usu_roles.includes('admin')) {
            const acta_ips = await this.actaSpIpsRepository.createQueryBuilder('acta_ips')
                .select(['acta_ips'])
                .where('acta_ips.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
                .orderBy("CASE WHEN acta_ips.act_estado = '1' THEN 0 ELSE 1 END, acta_ips.act_estado")
                .getMany()
            if (acta_ips.length === 0) throw new NotFoundException(new MessageDto('No hay Evaluaciones Asignadas'))
            return acta_ips;
        } else {
            const acta_ips = await this.actaSpIpsRepository.createQueryBuilder('acta_ips')
                .select(['acta_ips'])
                .orderBy("CASE WHEN acta_ips.act_estado = '1' THEN 0 ELSE 1 END, acta_ips.act_estado")
                .getMany()
            if (acta_ips.length === 0) throw new NotFoundException(new MessageDto('No hay evaluaciones asignadas'))
            return acta_ips;
        }

    }



    //ENCONTRAR POR ACTA POR ID PRIMARY_KEY
    async findByActa(id: number): Promise<ActaSpIpsEntity> {
        const ips = await this.actaSpIpsRepository.createQueryBuilder('acta_ips')
            .select(['acta_ips'])
            .where('acta_ips.id = :id_acta', { id_acta: id })
            .getOne()
        return ips;
    }



    //ÚLTIMA ACTA REGISTRADA
    async getLastestActa(): Promise<ActaSpIpsEntity> {
        const anioActual: number = new Date().getFullYear();

        const acta = await this.actaSpIpsRepository.createQueryBuilder('acta')
            .addSelect('acta.act_id')
            .orderBy('acta.act_id', 'DESC')
            .getOne();

        if (!acta) {
            const newActa: ActaSpIpsEntity = new ActaSpIpsEntity();
            newActa.act_id = 1;
            return newActa;
        }

        acta.act_creado = new Date(acta.act_creado);


        if (acta.act_creado.getFullYear() === anioActual) {
            acta.act_id++;
        } else {
            acta.act_id = 1;
        }

        return acta;
    }


    //ENCONTRAR ACTAS POR FECHA EXACTA Y/O NUMERO DE ACTA Y/O NOMBRE PRESTADOR Y/O NIT

    //ENCONTRAR ACTAS POR FECHA EXACTA Y/O NUMERO DE ACTA Y/O NOMBRE PRESTADOR Y/O NIT
    async findAllBusqueda(year?: number, numActa?: number, nomPresta?: string, nit?: string, tokenDto?: string): Promise<ActaSpIpsEntity[]> {
        const usuario = await this.jwtService.decode(tokenDto);

        const payloadInterface: PayloadInterface = {
            usu_id: usuario[`usu_id`],
            usu_nombre: usuario[`usu_nombre`],
            usu_apellido: usuario[`usu_apellido`],
            usu_nombreUsuario: usuario[`usu_nombreUsuario`],
            usu_email: usuario[`usu_email`],
            usu_estado: usuario[`usu_estado`],
            usu_roles: usuario[`usu_roles`]
        };

        //LISTAR POR PARAMETRO INGRESADO SOLO AL ID QUE LE CORRESPONDA EL ACTA
        if (!payloadInterface.usu_roles.includes('admin')) {
            let query = this.actaSpIpsRepository.createQueryBuilder('acta');

            if (numActa) {
                query = query.where('acta.act_id = :numActa', { numActa });
                query.andWhere('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
            }

            if (year) {
                if (numActa || nomPresta || nit) { //CONDICION SI EXISTE UNO DE LAS CONDICIONES DEL IF SE BUSQUE POR AND
                    query = query.andWhere('YEAR(acta.act_creado) = :year', { year });
                    query.andWhere('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
                } else {
                    query = query.orWhere('YEAR(acta.act_creado) = :year', { year });
                    query.andWhere('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
                }
            }

            if (nomPresta) {
                if (year || numActa || nit) { //CONDICION SI EXISTE UNO DE LAS CONDICIONES DEL IF SE BUSQUE POR AND
                    query = query.andWhere('acta.act_prestador LIKE :nomPresta', { nomPresta: `%${nomPresta}%` });
                    query.andWhere('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
                }
                query = query.orWhere('acta.act_prestador LIKE :nomPresta', { nomPresta: `%${nomPresta}%` });
                query.andWhere('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
            }

            //LISTAR SI EXISTE EL NIT
            if (nit) {
                if (year || numActa || nomPresta) { //CONDICION SI EXISTE UNO DE LAS CONDICIONES DEL IF SE BUSQUE POR AND
                    query = query.andWhere('acta.act_nit LIKE :nit', { nit: `%${nit}%` });
                    query.andWhere('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
                } else {
                    query = query.orWhere('acta.act_nit LIKE :nit', { nit: `%${nit}%` });
                    query.andWhere('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
                }
            }

            //LISTAR POR ID DE FUNCIONARIO SI ALGUN CAMPO ES VACIO
            query.andWhere('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
            const actas = await query.getMany();

            if (actas.length === 0) {
                throw new NotFoundException(new MessageDto('No hay actas con los filtros especificados'));
            }

            return actas;

        }
        //LISTAR POR PARAMETROS PARA EL ADMIN 
        else {
            let query = this.actaSpIpsRepository.createQueryBuilder('acta');

            if (numActa) {
                query = query.where('acta.act_id = :numActa', { numActa });
            }

            if (year) {
                if (numActa || nomPresta || nit) { //CONDICION SI EXISTE UNO DE LAS CONDICIONES DEL IF SE BUSQUE POR AND
                    query = query.andWhere('YEAR(acta.act_creado) = :year', { year });
                } else {
                    query = query.orWhere('YEAR(acta.act_creado) = :year', { year });
                }
            }

            if (nomPresta) {
                if (year || numActa || nit) { //CONDICION SI EXISTE UNO DE LAS CONDICIONES DEL IF SE BUSQUE POR AND
                    query = query.andWhere('acta.act_prestador LIKE :nomPresta', { nomPresta: `%${nomPresta}%` });
                } else {
                    query = query.orWhere('acta.act_prestador LIKE :nomPresta', { nomPresta: `%${nomPresta}%` });
                }
            }

            if (nit) {
                if (year || numActa || nomPresta) { //CONDICION SI EXISTE UNO DE LAS CONDICIONES DEL IF SE BUSQUE POR AND
                    query = query.andWhere('acta.act_nit LIKE :nit', { nit: `%${nit}%` });
                }
                query = query.orWhere('acta.act_nit LIKE :nit', { nit: `%${nit}%` });
            }

            const actas = await query.getMany();

            if (actas.length === 0) {
                throw new NotFoundException(new MessageDto('No hay actas con los filtros especificados'));
            }

            return actas;
        }
    }

    /*CREACIÓN SP IPS ACTA PDF */
    async create(payloads: {
        dto: IpsDto;
        evaluacionesIds: number[];
        tokenDto: TokenDto;
    }): Promise<any> {
        const { dto, evaluacionesIds, tokenDto } = payloads;


        try {
            const year = new Date().getFullYear().toString();

            //Crear el ACTA DTO
            const acta_SpIpsPdf = this.actaSpIpsRepository.create(dto);


            //ASIGNACIÓN DE LAS EVALUACIONES
            const evaluaciones = await this.evaluacionesIps.findByIds(evaluacionesIds)
            acta_SpIpsPdf.evaluacionesips = evaluaciones

            //GUARDAR EL ACTA EN LA BASE DE DATOS
            await this.actaSpIpsRepository.save(acta_SpIpsPdf);

            const usuario = await this.jwtService.decode(tokenDto.token);

            const payloadInterface: PayloadInterface = {
                usu_id: usuario[`usu_id`],
                usu_nombre: usuario[`usu_nombre`],
                usu_apellido: usuario[`usu_apellido`],
                usu_nombreUsuario: usuario[`usu_nombreUsuario`],
                usu_email: usuario[`usu_email`],
                usu_estado: usuario[`usu_estado`],
                usu_roles: usuario[`usu_roles`]
            };

            await this.auditoria_registro_services.logCreateActaSpIps(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                dto.act_id,
                year,
                dto.act_prestador,
                dto.act_cod_prestador
            );
            return { error: false, message: 'El acta ha sido creada' };
        } catch (error) {
            // Devuelve un mensaje de error apropiado
            return { error: true, message: 'Error al crear el acta. Por favor, inténtelo de nuevo.' };
        }
    }

    // ACTUALIZAR ACTA AGREGANDO LA CAPTURA DE LA IMAGEN
    async actualizarActaConImagen(actaId: string, imagePath: string): Promise<any> {
        try {
            const acta_number = parseInt(actaId, 10)
            // Encuentra el acta por su ID
            const acta = await this.actaSpIpsRepository.findOneById(acta_number)

            // Asigna la ruta de la imagen al campo act_captura_imagen
            acta.act_captura_imagen = imagePath;

            // Guarda los cambios en la base de datos
            await this.actaSpIpsRepository.save(acta);

            return { success: true };
        } catch (error) {
            return { success: false };
        }
    }


    // Cargar Imagen
    async cargarImagenActa(file: Express.Multer.File, actaId: string): Promise<any> {
        const timestamp = Date.now();
        const nombreArchivo = `${actaId}_${timestamp}_ips`;

        const imagePath = path.join(UPLOADS_PATH, `${actaId}_${timestamp}_ips`);
        const destinationPath = path.join(imagePath, nombreArchivo);

        try {
            fs.mkdirSync(imagePath, { recursive: true });
            fs.writeFileSync(destinationPath, file.buffer);
            await this.actualizarActaConImagen(actaId, destinationPath)
            return { success: true, message: 'La imagen ha sido cargada exitosamente' };
        } catch (error) {
            return { success: false, message: 'Error al cargar la imagen' };
        }
    }


    //ACTUALIZAR  SP IPS ACTA PDF
    async updateActaIps(id: number, payload: { dto: IpsDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payload;
            const acta_ips = await this.findByActa(id);
            if (!acta_ips) {
                throw new NotFoundException(new MessageDto('El Acta no existe'))
            }
            dto.act_id ? acta_ips.act_id = dto.act_id : acta_ips.act_id = acta_ips.act_id;
            acta_ips.act_visita_inicial = dto.act_visita_inicial !== undefined ? dto.act_visita_inicial : "";
            acta_ips.act_visita_seguimiento = dto.act_visita_seguimiento !== undefined ? dto.act_visita_seguimiento : "";
            dto.act_fecha_inicial ? acta_ips.act_fecha_inicial = dto.act_fecha_inicial : acta_ips.act_fecha_inicial = acta_ips.act_fecha_inicial;
            dto.act_fecha_final ? acta_ips.act_fecha_final = dto.act_fecha_final : acta_ips.act_fecha_final = acta_ips.act_fecha_final;
            dto.act_municipio ? acta_ips.act_municipio = dto.act_municipio : acta_ips.act_municipio = acta_ips.act_municipio;
            dto.act_prestador ? acta_ips.act_prestador = dto.act_prestador : acta_ips.act_prestador = acta_ips.act_prestador;
            dto.act_nit ? acta_ips.act_nit = dto.act_nit : acta_ips.act_nit = acta_ips.act_nit;
            dto.act_direccion ? acta_ips.act_direccion = dto.act_direccion : acta_ips.act_direccion = acta_ips.act_direccion;
            dto.act_barrio ? acta_ips.act_barrio = dto.act_barrio : acta_ips.act_barrio = acta_ips.act_barrio;
            dto.act_telefono ? acta_ips.act_telefono = dto.act_telefono : acta_ips.act_telefono = acta_ips.act_telefono;
            dto.act_email ? acta_ips.act_email = dto.act_email : acta_ips.act_email = acta_ips.act_email;
            dto.act_representante ? acta_ips.act_representante = dto.act_representante : acta_ips.act_representante = acta_ips.act_representante;
            dto.act_cod_prestador ? acta_ips.act_cod_prestador = dto.act_cod_prestador : acta_ips.act_cod_prestador = acta_ips.act_cod_prestador;
            dto.act_obj_visita ? acta_ips.act_obj_visita = dto.act_obj_visita : acta_ips.act_obj_visita = acta_ips.act_obj_visita;
            //ASIGNACIÓN DE LOS COMPROMISOS:
            dto.act_compromiso_actividad ? acta_ips.act_compromiso_actividad = dto.act_compromiso_actividad : acta_ips.act_compromiso_actividad = acta_ips.act_compromiso_actividad;
            dto.act_compromiso_fecha ? acta_ips.act_compromiso_fecha = dto.act_compromiso_fecha : acta_ips.act_compromiso_fecha = acta_ips.act_compromiso_fecha;
            dto.act_compromiso_responsable ? acta_ips.act_compromiso_responsable = dto.act_compromiso_responsable : acta_ips.act_compromiso_responsable = acta_ips.act_compromiso_responsable;

            dto.act_nombre_funcionario ? acta_ips.act_nombre_funcionario = dto.act_nombre_funcionario : acta_ips.act_nombre_funcionario = acta_ips.act_nombre_funcionario;
            dto.act_cargo_funcionario ? acta_ips.act_cargo_funcionario = dto.act_cargo_funcionario : acta_ips.act_cargo_funcionario = acta_ips.act_cargo_funcionario;
            dto.act_firma_funcionario ? acta_ips.act_firma_funcionario = dto.act_firma_funcionario : acta_ips.act_firma_funcionario = acta_ips.act_firma_funcionario;
            dto.act_nombre_prestador ? acta_ips.act_nombre_prestador = dto.act_nombre_prestador : acta_ips.act_nombre_prestador = acta_ips.act_nombre_prestador;
            dto.act_cargo_prestador ? acta_ips.act_cargo_prestador = dto.act_cargo_prestador : acta_ips.act_cargo_prestador = acta_ips.act_cargo_prestador;
            dto.act_firma_prestador ? acta_ips.act_firma_prestador = dto.act_firma_prestador : acta_ips.act_firma_prestador = acta_ips.act_firma_prestador;
            dto.act_nombre_prestador_acompanante ? acta_ips.act_nombre_prestador_acompanante = dto.act_nombre_prestador_acompanante : acta_ips.act_nombre_prestador_acompanante = acta_ips.act_nombre_prestador_acompanante;
            dto.act_cargo_prestador_acompanante ? acta_ips.act_cargo_prestador_acompanante = dto.act_cargo_prestador_acompanante : acta_ips.act_cargo_prestador_acompanante = acta_ips.act_cargo_prestador_acompanante;
            dto.act_firma_prestador_acompanante ? acta_ips.act_firma_prestador_acompanante = dto.act_firma_prestador_acompanante : acta_ips.act_firma_prestador_acompanante = acta_ips.act_firma_prestador_acompanante;
            dto.noFirmaActa ? acta_ips.noFirmaActa = dto.noFirmaActa : acta_ips.noFirmaActa = acta_ips.noFirmaActa = acta_ips.noFirmaActa;

            const usuario = await this.jwtService.decode(tokenDto.token);

            const payloadInterface: PayloadInterface = {
                usu_id: usuario[`usu_id`],
                usu_nombre: usuario[`usu_nombre`],
                usu_apellido: usuario[`usu_apellido`],
                usu_nombreUsuario: usuario[`usu_nombreUsuario`],
                usu_email: usuario[`usu_email`],
                usu_estado: usuario[`usu_estado`],
                usu_roles: usuario[`usu_roles`]
            };

            const year = new Date().getFullYear().toString();

            await this.actaSpIpsRepository.save(acta_ips);
            await this.auditoria_actualizacion_service.logUpdateActaSpIps(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                dto.act_id,
                year,
                dto.act_prestador,
                dto.act_cod_prestador
            );

            return new MessageDto(`El acta ha sido Actualizada`);
        }
        catch (error) {
            // En caso de otra excepción, se devuelve un mensaje genérico
            return { error: true, message: 'Ocurrió un error al Actualizar el Acta' };
        }

    }


    //CERRAR ACTA SP
    async cerrarActa(id: number, payload: { tokenDto: TokenDto }): Promise<any> {

        const { tokenDto } = payload;

        try {
            const acta = await this.findByActa(id);

            if (!acta) {
                throw new NotFoundException(new MessageDto('El Acta no existe'));
            }

            acta.act_estado = '0'

            const usuario = await this.jwtService.decode(tokenDto.token);

            const payloadInterface: PayloadInterface = {
                usu_id: usuario[`usu_id`],
                usu_nombre: usuario[`usu_nombre`],
                usu_apellido: usuario[`usu_apellido`],
                usu_nombreUsuario: usuario[`usu_nombreUsuario`],
                usu_email: usuario[`usu_email`],
                usu_estado: usuario[`usu_estado`],
                usu_roles: usuario[`usu_roles`]
            };

            const year = new Date().getFullYear().toString();

            await this.actaSpIpsRepository.save(acta);
            await this.auditoria_registro_services.logCierreActaSpIps(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                acta.act_id,
                year,
                acta.act_prestador,
                acta.act_cod_prestador
            );

            return new MessageDto('El Acta ha sido Cerrada');
        } catch (error) {
            // Devuelve un mensaje de error apropiado
            return { error: true, message: 'Ocurrió un error al cerrar el Acta' };
        }
    }


    //La función para generar el PDF con las tablas ajustadas
    async generarPdfEvaluacionIps(evaips_id: number, acta_id: number): Promise<Buffer> {

        const ajuste = await this.calificacionipsAjusteService.getallCalCrixEva(evaips_id, acta_id);
        const implementacion = await this.calificacionipsImplementacionService.getallCalCrixEva(evaips_id, acta_id);
        const planeacion = await this.calificacionipsPlaneacionService.getallCalCrixEva(evaips_id, acta_id);
        const verificacion = await this.calificacionipsVerificacionService.getallCalCrixEva(evaips_id, acta_id);


        let eva = "";

        let nombreprestador = "";
        let cargoprestador = "";
        let nombrefuncionario = "";
        let cargofuncionario = "";



        const pdfBuffer: Buffer = await new Promise(resolve => {
            const doc = new PDFDocument({
                size: 'LETTER',
                bufferPages: true,
                autoFirstPage: false,
            });

            let pageNumber = 0;

            doc.on('pageAdded', () => {
                pageNumber++;
                let bottom = doc.page.margins.bottom;

                doc.image(join(process.cwd(), "src/uploads/encabezados/EncabezadoEvaluacionSic.png"), doc.page.width - 550, 20, { fit: [500, 500], align: 'center' })
                doc.moveDown()

                doc.page.margins.top = 115;
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
                    }
                );
                doc.page.margins.bottom = bottom;

            });

            doc.addPage();
            doc.text('', 180, 110);
            doc.font('Helvetica-Bold').fontSize(14);
            doc.text('PROGRAMA DE SEGURIDAD DEL PACIENTE ');
            doc.text('', 187, 130);
            doc.font('Helvetica-Bold').fontSize(14);
            doc.text('ACTA DE VERIFICACION Y SEGUIMIENTO');
            // doc.moveDown();
            // doc.font('Helvetica').fontSize(14);

            doc.text('', 50, 110);
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();


            function hayEspacioSuficiente(alturaContenido: number) {
                const margenInferior = doc.page.margins.bottom;
                const alturaPagina = doc.page.height;
                const espacioRestante = alturaPagina - margenInferior - alturaContenido;
                return espacioRestante <= 0;
            }

            ajuste.forEach(evalua => {
                eva = evalua.calificacionipsAjuste.cri_aju_eva.evips_nombre;
                evalua.calificacionipsAjuste.cri_aju_eva.actas_ips.forEach(acta => {
                    nombreprestador = acta.act_nombre_prestador;
                    nombrefuncionario = acta.act_nombre_funcionario;
                    cargoprestador = acta.act_cargo_prestador;
                    cargofuncionario = acta.act_cargo_funcionario
                });
            });
            doc.text(eva)


            // Agregar las tablas a las páginas
            if (ajuste.length) {
                let rows_elements = [];

                ajuste.forEach(item => {
                    var temp_list = [item.calificacionipsAjuste.cri_aju_id, item.calificacionipsAjuste.cri_aju_nombre, '            ' + item.cal_nota, item.calificacionipsAjuste.cri_aju_verificacion, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [10, 210, 72, 65, 175],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,

                };
                const table4 = {
                    title: "AJUSTE",
                    headers: ["", "CRITERIOS", "CALIFICACIÓN", "VERIFICACIÓN", "OBSERVACIONES"],
                    rows: rows_elements

                };
                doc.moveDown();
                // Verificar si hay suficiente espacio en la página actual para la tabla
                if (hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
                    doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
                    pageNumber++; // Incrementar el número de página
                }
                doc.table(table4, tableOptions);

            }

            if (planeacion.length) {
                let rows_elements = [];
                planeacion.forEach(item => {
                    var temp_list = [item.calificacionipsPlaneacion.cri_pla_id, item.calificacionipsPlaneacion.cri_pla_nombre, '            ' + item.cal_nota, item.calificacionipsPlaneacion.cri_pla_verificacion, item.cal_observaciones];

                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [10, 210, 72, 65, 175],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };
                const table = {
                    title: "PLANEACIÓN",
                    headers: ["", "CRITERIOS", "CALIFICACION", "VERIFICACION", "OBSERVACIONES"],
                    rows: rows_elements
                };
                doc.moveDown();
                // Verificar si hay suficiente espacio en la página actual para la tabla
                if (hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
                    doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
                    pageNumber++; // Incrementar el número de página
                }
                doc.table(table, tableOptions);

            }


            if (implementacion.length) {
                let rows_elements = [];
                implementacion.forEach(item => {
                    var temp_list = [item.calificacionipsImpl.cri_imp_id, item.calificacionipsImpl.cri_imp_nombre, '            ' + item.cal_nota, item.calificacionipsImpl.cri_imp_verificacion, item.cal_observaciones];

                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [10, 210, 72, 65, 175],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };
                const table2 = {
                    title: "IMPLEMENTACIÓN",
                    headers: ["", "CRITERIOS", "CALIFICACION", "VERIFICACION", "OBSERVACIONES"],
                    rows: rows_elements
                };
                doc.moveDown();
                // Verificar si hay suficiente espacio en la página actual para la tabla
                if (hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
                    doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
                    pageNumber++; // Incrementar el número de página
                }

                doc.table(table2, tableOptions);

            }


            if (verificacion.length) {
                let rows_elements = [];
                verificacion.forEach(item => {
                    var temp_list = [item.calificacionipsVerif.cri_ver_id, item.calificacionipsVerif.cri_ver_nombre, '            ' + item.cal_nota, item.calificacionipsVerif.cri_ver_verificacion, item.cal_observaciones];

                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [10, 210, 72, 65, 175],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };
                const table3 = {
                    title: "VERIFICACIÓN",
                    headers: ["", "CRITERIOS", "CALIFICACION", "VERIFICACION", "OBSERVACIONES"],
                    rows: rows_elements
                };
                doc.moveDown();
                // Verificar si hay suficiente espacio en la página actual para la tabla
                if (hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
                    doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
                    pageNumber++; // Incrementar el número de página
                }

                doc.table(table3, tableOptions);

            }

            doc.moveDown();
            doc.moveDown();

            let rows_elements = [[`NOMBRE: ${nombreprestador}`, `NOMBRE: ${nombrefuncionario}`],
            [`CARGO: ${cargoprestador}`, `CARGO: ${cargofuncionario}`],
            ["FIRMA", "FIRMA"]];

            const tableOptions2 = {
                columnsSize: [266, 266],
                headerAlign: 'center',
                align: 'center',
                rowHeight: 15,
            };

            const tablefirmas = {
                headers: ["POR EL PRESTADOR", "POR LA SECRETARIA DE SALUD"],
                rows: rows_elements
            };

            // Verificar si hay suficiente espacio en la página actual para la tabla
            if (hayEspacioSuficiente(tableOptions2.rowHeight * rows_elements.length)) {
                doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
                pageNumber++; // Incrementar el número de página
            }

            doc.table(tablefirmas, tableOptions2);

            const buffer = [];
            doc.on('data', buffer.push.bind(buffer));
            doc.on('end', () => {
                const data = Buffer.concat(buffer);
                resolve(data);
            });

            doc.end();
        });

        return pdfBuffer;
    }



}
