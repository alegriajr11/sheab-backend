import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActaPamecEntity } from './pamec-acta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActaPamecRepository } from './pamec-acta.repository';
import { MessageDto } from 'src/common/message.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { PrestadorRepository } from 'src/prestador/prestador.repository';
import { EvaluacionPamecEntity } from 'src/pamec/evaluacion-pamec.entity';
import { EvaluacionPamecRepository } from 'src/pamec/evaluacion-pamec.repository';
import { EvaluacionPamecDto } from 'src/pamec/dto/evaluacionpamec.dto';
import { ActividadEntity } from 'src/pamec/actividad.entity';
import { ActividadRepository } from 'src/pamec/actividad.repository';
import { ActaPamecDto } from '../dto/pamec-acta.dto';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { CriteriopamService } from 'src/pamec/actividad/criteriopam/criteriopam.service';
import { join } from 'path';
import { CalificacionpamecService } from 'src/pamec/calificacionpamec/calificacionpamec.service';
import { EvaluacionpamecService } from 'src/pamec/evaluacionpamec/evaluacionpamec.service';

const PDFDocument = require('pdfkit-table')
@Injectable()
export class PamecActaService {
    constructor(
        @InjectRepository(ActaPamecEntity)
        private readonly actaPamecRepository: ActaPamecRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
        @InjectRepository(EvaluacionPamecEntity)
        private readonly evaluacionPamecRepository: EvaluacionPamecRepository,
        @InjectRepository(ActividadEntity)
        private readonly actividadRepository: ActividadRepository,
        private readonly auditoria_actualizacion_service: AuditoriaActualizacionService,
        @Inject(CalificacionpamecService)
        private readonly calificacionpamecService: CalificacionpamecService,
        @Inject(EvaluacionpamecService)
        private readonly evaluacionpamecService: EvaluacionpamecService,
    ) { }

    //LISTAR TODAS ACTAS PAMEC PDF
    async getallActas(): Promise<ActaPamecEntity[]> {
        const indep = await this.actaPamecRepository.createQueryBuilder('acta')
            .select(['acta'])
            .getMany()
        if (indep.length === 0) throw new NotFoundException(new MessageDto('No hay Evaluaciones Realiazadas en la lista'))
        return indep;
    }

    //ENCONTRAR POR ACTA
    async findByActa(id: number): Promise<ActaPamecEntity> {
        const acta_pamec = await this.actaPamecRepository.findOne({ where: { id } });
        if (!acta_pamec) {
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return acta_pamec;
    }


    //ÚLTIMA ACTA REGISTRADA
    async getLastestActa(): Promise<ActaPamecDto> {
        const anioActual: number = new Date().getFullYear();

        const acta = await this.actaPamecRepository.createQueryBuilder('acta')
            .addSelect('acta.act_id')
            .orderBy('acta.act_id', 'DESC')
            .getOne();

        if (!acta) {
            const newActa: ActaPamecEntity = new ActaPamecEntity();
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

    //CERRAR ACTA PAMEC
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

            await this.actaPamecRepository.save(acta);
            await this.auditoria_registro_services.logCierreActaSpInd(
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


    //ENCONTRAR ACTAS POR FECHA EXACTA Y/O NUMERO DE ACTA Y/O NOMBRE PRESTADOR Y/O NIT
    async findAllBusqueda(year?: number, numActa?: number, nomPresta?: string, nit?: string, tokenDto?: string): Promise<ActaPamecEntity[]> {
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
            let query = this.actaPamecRepository.createQueryBuilder('acta');

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
            let query = this.actaPamecRepository.createQueryBuilder('acta');

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

    //CREAR ACTA PAMEC
    async create(payloads: { dto: ActaPamecDto, tokenDto: TokenDto }): Promise<any> {
        const { dto, tokenDto } = payloads;
        console.log(dto.act_tipo_visita)
        try {
            const acta_pamecpdf = this.actaPamecRepository.create(dto);

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

            await this.actaPamecRepository.save(acta_pamecpdf);

            const acta_ultima = await this.actaPamecRepository.createQueryBuilder('acta')
                .addSelect('acta.id')
                .orderBy('acta.act_id', 'DESC')
                .getOne();

            //CONSULTAR LA ULTIMA ACTA QUE SE ASIGNARA A LA EVALUACION
            const acta = await this.actaPamecRepository.findOne({ where: { id: acta_ultima.id } })

            //ASIGNAMOS LOS DATOS DE LA ACTA REGISTRADA PARA CONSTRUIR EL DTO DE EVALUACION-INDEPENDIENTES
            const eva_creado = acta_ultima.act_creado;
            const eva_acta_prestador = acta_ultima.act_cod_prestador; // Valor del ID del prestador

            //CONSULTAR EL PRESTADOR QUE TIENE EL ACTA
            const prestador = await this.prestadorRepository.findOne({ where: { pre_cod_habilitacion: eva_acta_prestador } })


            //ASIGNAMOS LOS DATOS AL DTO
            const evaluacionDto: EvaluacionPamecDto = {
                eva_creado
            }

            //CREAMOS EL DTO
            const evaluacion_pamec = await this.evaluacionPamecRepository.create(evaluacionDto)

            //ASIGNACION DE FORANEA ACTA UNO A UNO
            evaluacion_pamec.eval_acta_pamec = acta
            //ASIGNACION DE FORANEA PRESTADOR UNO A MUCHOS
            evaluacion_pamec.eval_prestador = prestador

            //GUARDAMOS EN LA ENTIDAD EVALUACION-PAMEC
            await this.evaluacionPamecRepository.save(evaluacion_pamec)

            // //CONSULTAR LA ÚLTIMA EVALUACIÓN EXISTENTE
            // const evaluacion_ultima = await this.evaluacionPamecRepository.createQueryBuilder('evaluacion')
            //     .addSelect('evaluacion.eva_id')
            //     .orderBy('evaluacion.eva_id', 'DESC')
            //     .getOne();

            // //GUARDAR LA RELACIÓN ENTRE EVALUACIÓN Y ETAPAS
            // await this.evaluacionPamecRepository.save(evaluacion_ultima);

            //ASIGNAR LA AUDITORIA DEL ACTA CREADA
            await this.auditoria_registro_services.logCreateActaPamec(
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
            console.log(error)
            return { error: true, message: 'Error al crear el acta. Por favor, inténtelo de nuevo.' };
        }

    }


    //ACTUALIZAR PAMEC IPS ACTA PDF

    async updateActaipspam(id: number, payload: { dto: ActaPamecDto, tokenDto: TokenDto }): Promise<any> {
        const { dto, tokenDto } = payload;
        const ips = await this.findByActa(id);
        if (!ips) {
            throw new NotFoundException(new MessageDto('El Acta no existe'))
        }
        dto.act_id ? ips.act_id = dto.act_id : ips.act_id = ips.act_id;
        dto.act_fecha_visita ? ips.act_fecha_visita = dto.act_fecha_visita : ips.act_fecha_visita = ips.act_fecha_visita;
        dto.act_tipo_visita ? ips.act_tipo_visita = dto.act_tipo_visita : ips.act_tipo_visita = ips.act_tipo_visita;
        dto.act_municipio ? ips.act_municipio = dto.act_municipio : ips.act_municipio = ips.act_municipio;
        dto.act_prestador ? ips.act_prestador = dto.act_prestador : ips.act_prestador = ips.act_prestador;
        dto.act_nit ? ips.act_nit = dto.act_nit : ips.act_nit = ips.act_nit;
        dto.act_direccion ? ips.act_direccion = dto.act_direccion : ips.act_direccion = ips.act_direccion;
        dto.act_barrio ? ips.act_barrio = dto.act_barrio : ips.act_barrio = ips.act_barrio;
        dto.act_telefono ? ips.act_telefono = dto.act_telefono : ips.act_telefono = ips.act_telefono;
        dto.act_email ? ips.act_email = dto.act_email : ips.act_email = ips.act_email;
        dto.act_representante ? ips.act_representante = dto.act_representante : ips.act_representante = ips.act_representante;
        dto.act_cod_prestador ? ips.act_cod_prestador = dto.act_cod_prestador : ips.act_cod_prestador = ips.act_cod_prestador;
        dto.act_nombre_funcionario1 ? ips.act_nombre_funcionario1 = dto.act_nombre_funcionario1 : ips.act_nombre_funcionario1 = ips.act_nombre_funcionario1;
        dto.act_cargo_funcionario1 ? ips.act_cargo_funcionario1 = dto.act_cargo_funcionario1 : ips.act_cargo_funcionario1 = ips.act_cargo_funcionario1;
        dto.act_nombre_funcionario2 = dto.act_nombre_funcionario2 !== undefined ? dto.act_nombre_funcionario2 : "";
        dto.act_cargo_funcionario2 = dto.act_cargo_funcionario2 !== undefined ? dto.act_cargo_funcionario2 : "";
        dto.act_nombre_prestador ? ips.act_nombre_prestador = dto.act_nombre_prestador : ips.act_nombre_prestador = ips.act_nombre_prestador;
        dto.act_cargo_prestador ? ips.act_cargo_prestador = dto.act_cargo_prestador : ips.act_cargo_prestador = ips.act_cargo_prestador;
        dto.act_obj_visita ? ips.act_obj_visita = dto.act_obj_visita : ips.act_obj_visita = ips.act_obj_visita;
        dto.act_firma_prestador ? ips.act_firma_prestador = dto.act_firma_prestador : ips.act_firma_prestador = ips.act_firma_prestador;
        // dto.act_firma_funcionario ? ips.act_firma_funcionario = dto.act_firma_funcionario : ips.act_firma_funcionario = ips.act_firma_funcionario;

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

        await this.actaPamecRepository.save(ips);
        await this.auditoria_actualizacion_service.logUpdateActaPamec(
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

    //GENERACIÓN DE REPORTE DE CUMPLIMIENTO DEL PROGRAMA DE PAMEC


    // La función para generar el PDF con las tablas ajustadas
    async generarPdfEvaluacionPamec(id: number): Promise<Buffer> {
        const titulo_uno = await this.calificacionpamecService.getallcriterioxtitulouno(id);
        const titulo_dos = await this.calificacionpamecService.getallcriterioxtitulodos(id);
        const titulo_tres = await this.calificacionpamecService.getallcriterioxtitulotres(id);
        const titulo_cuatro = await this.calificacionpamecService.getallcriterioxtitulocuatro(id);
        const titulo_cinco = await this.calificacionpamecService.getallcriterioxtitulocuatro(id);
        const titulo_seis = await this.calificacionpamecService.getallcriterioxtitulocuatro(id);
        const titulo_siete = await this.calificacionpamecService.getallcriterioxtitulocuatro(id);
        const titulo_ocho = await this.calificacionpamecService.getallcriterioxtitulocuatro(id);
        const titulo_nueve = await this.calificacionpamecService.getallcriterioxtitulocuatro(id);
        const titulo_diez = await this.calificacionpamecService.getallcriterioxtitulocuatro(id);
        const acta = await this.evaluacionpamecService.getallEvaActa(id);

        let nombreprestador = "";
        let prestadorPrincipal = "";
        let cargoprestador = "";
        let nombrefuncionario = "";
        let cargofuncionario = "";

        let totalCalificacionesActividad1 = 0
        let totalCalificacionesCountActividad1 = 0; // Contador para la cantidad total de calificaciones

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

                doc.image(join(process.cwd(), "src/uploads/EncabezadoEvaluacionSic.png"), doc.page.width - 550, 20, { fit: [500, 500], align: 'center' })
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
            doc.text('', 155, 110);
            doc.font('Helvetica-Bold').fontSize(14);
            doc.text('EVALUACIÓN DE VERIFICACIÓN AL PAMEC ');
            doc.font('Helvetica-Bold').fontSize(14);
            // doc.moveDown();
            // doc.font('Helvetica').fontSize(14);

            doc.text('', 50, 110);
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();


            // doc.fontSize(24);
            function hayEspacioSuficiente(alturaContenido: number) {
                const margenInferior = doc.page.margins.bottom;
                const alturaPagina = doc.page.height;
                const espacioRestante = alturaPagina - margenInferior - alturaContenido;
                return espacioRestante >= 0;
            }

            //ASIGNAR NOMBRES DEL PRESTADOR Y FUNCIONARIO EN EL PDF
            acta.forEach(acta => {
                prestadorPrincipal = acta.eval_acta_pamec.act_prestador;
                nombreprestador = acta.eval_acta_pamec.act_nombre_prestador;
                nombrefuncionario = acta.eval_acta_pamec.act_nombre_funcionario1;
                cargoprestador = acta.eval_acta_pamec.act_cargo_prestador;
                cargofuncionario = acta.eval_acta_pamec.act_cargo_funcionario1;
            })
            doc.text(prestadorPrincipal)

            if (titulo_uno.length) {
                let rows_elements = [];

                titulo_uno.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table = {
                    title: "ACTIVIDADES PREVIAS",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable1 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable1.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable1.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table.title,
                            headers: table.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table.title,
                            headers: table.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }



            doc.moveDown();
            if (titulo_dos.length) {
                let rows_elements = [];

                titulo_dos.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table2 = {
                    title: "AUTOEVALUACIÓN",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable2 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable2.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable2.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table2.title,
                            headers: table2.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table2.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table2.title,
                            headers: table2.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }

            if (titulo_tres.length) {
                let rows_elements = [];

                titulo_tres.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table3 = {
                    title: "SELECCIÓN DE LOS PROCESOS A MEJORAR",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable3 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable3.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable3.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table3.title,
                            headers: table3.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table3.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table3.title,
                            headers: table3.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }



            if (titulo_cuatro.length) {
                let rows_elements = [];

                titulo_cuatro.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table4 = {
                    title: "PRIORIZACION",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable4 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable4.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable4.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table4.title,
                            headers: table4.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table4.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table4.title,
                            headers: table4.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }


            if (titulo_cinco.length) {
                let rows_elements = [];

                titulo_cinco.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table5 = {
                    title: "DEFINICIÓN DE LA CALIDAD ESPERADA",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable5 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable5.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable5.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table5.title,
                            headers: table5.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table5.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table5.title,
                            headers: table5.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }


            if (titulo_seis.length) {
                let rows_elements = [];

                titulo_seis.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table6 = {
                    title: "DEFINICIÓN DE LA CALIDAD OBSERVADA",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable6 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable6.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable6.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table6.title,
                            headers: table6.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table6.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table6.title,
                            headers: table6.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }


            if (titulo_siete.length) {
                let rows_elements = [];

                titulo_siete.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table7 = {
                    title: "PLAN DE MEJORAMIENTO PARA EL CIERRE DE BRECHAS",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable7 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable7.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable7.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table7.title,
                            headers: table7.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table7.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table7.title,
                            headers: table7.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }


            if (titulo_ocho.length) {
                let rows_elements = [];

                titulo_ocho.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table8 = {
                    title: "EJECUCION Y SEGUIMIENTO AL PLAN DE MEJORAMIENTO",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable8 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable8.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable8.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table8.title,
                            headers: table8.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table8.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table8.title,
                            headers: table8.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }


            if (titulo_nueve.length) {
                let rows_elements = [];

                titulo_nueve.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table9 = {
                    title: "EVALUACION PLAN DE MEJORAMIENTO",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable9 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable9.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable9.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table9.title,
                            headers: table9.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table9.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table9.title,
                            headers: table9.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }


            if (titulo_diez.length) {
                let rows_elements = [];

                titulo_diez.forEach(item => {
                    // totalCalificacionesEtapa1 += item.cal_nota
                    // totalCalificacionesCountEtapa1++; // Incrementar el contador

                    var temp_list = [item.criteriopam_calificacion.crip_nombre, item.criteriopam_calificacion.crip_desarrollo_etapas, '    ' + item.cal_nota, item.cal_aplica, item.cal_observaciones];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [120, 210, 32, 35, 135],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };

                const table10 = {
                    title: "APRENDIZAJE ORGANIZACIONAL",
                    headers: ["CRITERIOS", "DESARROLLO DE LOS CRITERIOS POR ETAPAS", "NOTA", "APLICA", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunksTable10 = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunksTable10.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunksTable10.forEach((section, index) => {
                    // Calcular el espacio requerido para la sección
                    const sectionHeight = section.length * tableOptions.rowHeight;

                    // Verificar si hay espacio suficiente en la página actual
                    if (hayEspacioSuficiente(sectionHeight)) {
                        // Agregar la sección a la página actual
                        doc.table({
                            title: table10.title,
                            headers: table10.headers,
                            rows: section
                        }, tableOptions);
                    } else {
                        // Agregar una nueva página antes de la sección
                        doc.addPage();
                        // Asegurarte de ajustar los encabezados o títulos según sea necesario
                        doc.font('Helvetica-Bold').fontSize(14).text(table10.title);
                        doc.moveDown();
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table10.title,
                            headers: table10.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                // const promedio = totalCalificacionesActividad1 / totalCalificacionesCountActividad1;
                // const promedioRedondeado = promedio.toFixed(2);

                // doc.text(`Calificación Promedio: ${promedioRedondeado}`);
            }

            // Tabla "PROFESIONAL INDEPENDIENTE"
            const tableOptions2 = {
                columnsSize: [225, 225],
                headerAlign: 'center',
                align: 'center',
                rowHeight: 15,
            };

            const tablefirmas = {
                headers: ["", ""],
                rows: [[`NOMBRE: ${nombreprestador}`, `NOMBRE: ${nombrefuncionario}`],
                [`CARGO: ${cargoprestador}`, `CARGO: ${cargofuncionario}`]]
            };

            // Dividir la tabla de firmas en secciones (por ejemplo, en grupos de 10 filas)
            const chunkSize = 10;
            const chunksTableFirmas = [];
            for (let i = 0; i < tablefirmas.rows.length; i += chunkSize) {
                chunksTableFirmas.push(tablefirmas.rows.slice(i, i + chunkSize));
            }

            // Iterar a través de las secciones y agregarlas al documento
            chunksTableFirmas.forEach((section, index) => {
                // Calcular el espacio requerido para la sección
                const sectionHeight = section.length * tableOptions2.rowHeight;

                // Verificar si hay espacio suficiente en la página actual
                if (hayEspacioSuficiente(sectionHeight)) {
                    // Agregar la sección a la página actual
                    doc.table({
                        headers: tablefirmas.headers,
                        rows: section
                    }, tableOptions2);
                } else {
                    // Agregar una nueva página antes de la sección
                    doc.addPage();
                    // Agregar la sección a la nueva página
                    doc.table({
                        headers: tablefirmas.headers,
                        rows: section
                    }, tableOptions2);
                }
            });


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
