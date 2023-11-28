import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ActaSicPdfEntity } from './sic-acta-pdf.entity';
import { ActaSicPdfRepository } from './sic-acta-pdf.repository';
import { ActaSicPdfDto } from '../dto/sic-acta-pdf.dto';
import { LessThan } from 'typeorm';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/auth/payload.interface';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { PrestadorRepository } from 'src/prestador/prestador.repository';
import { EvaluacionSicDto } from 'src/sic/dto/evaluacionsic.dto';
import { EvaluacionSicEntity } from 'src/sic/evaluacionsic.entity';
import { EvaluacionsicRepository } from 'src/sic/evaluacionsic.repository';
import { DominioEntity } from 'src/sic/dominio.entity';
import { DominioRepository } from 'src/sic/dominio.repository';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { CumplimientosicService } from 'src/sic/cumplimientosic/cumplimientosic.service';
import { join } from 'path';

const PDFDocument = require('pdfkit-table')

@Injectable()
export class SicActaService {

    constructor(
        @InjectRepository(ActaSicPdfEntity)
        private readonly acta_sic_pdfRepository: ActaSicPdfRepository,
        private readonly jwtService: JwtService,
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
        @InjectRepository(EvaluacionSicEntity)
        private readonly evaluacionSicRepository: EvaluacionsicRepository,
        @InjectRepository(DominioEntity)
        private readonly dominioRepository: DominioRepository,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_service: AuditoriaActualizacionService,
        @Inject(CumplimientosicService)
        private readonly cumplimientosicService: CumplimientosicService,
    ) { }

    //LISTAR TODAS LAS ACTAS SIC POR USUARIO ASIGNADO
    async getallActas(tokenDto: string): Promise<ActaSicPdfEntity[]> {
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
            const acta = await this.acta_sic_pdfRepository.createQueryBuilder('acta')
                .select(['acta'])
                .where('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
                .orderBy("CASE WHEN acta.act_estado = '1' THEN 0 ELSE 1 END, acta.act_estado")
                .getMany()
            if (acta.length === 0) throw new NotFoundException(new MessageDto('No tienes evaluaciones asignadas'))
            return acta;
        } else {
            const acta = await this.acta_sic_pdfRepository.createQueryBuilder('acta')
                .select(['acta'])
                .orderBy("CASE WHEN acta.act_estado = '1' THEN 0 ELSE 1 END, acta.act_estado")
                .getMany()
            if (acta.length === 0) throw new NotFoundException(new MessageDto('No hay evaluaciones asignadas'))
            return acta;
        }
    }

    //ENCONTRAR POR ACTA
    async findByActa(id: number): Promise<ActaSicPdfEntity> {
        const acta = await this.acta_sic_pdfRepository.findOne({ where: { id } });
        if (!acta) {
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return acta;
    }

    //ÚLTIMA ACTA REGISTRADA ID PRIMARY KEY
    async ultimaActaIdPk(): Promise<ActaSicPdfEntity> {
        const acta = await this.acta_sic_pdfRepository.createQueryBuilder('acta')
            .addSelect('acta.id')
            .orderBy('acta.id', 'DESC')
            .getOne();
        if (!acta) {
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return acta
    }

    //ÚLTIMA ACTA REGISTRADA Y SE INCREMENTA A UNO
    async getLastestActa(): Promise<ActaSicPdfEntity> {
        const anioActual: number = new Date().getFullYear();

        const acta = await this.acta_sic_pdfRepository.createQueryBuilder('acta')
            .addSelect('acta.act_id')
            .orderBy('acta.act_id', 'DESC')
            .getOne();

        if (!acta) {
            const newActa: ActaSicPdfEntity = new ActaSicPdfEntity();
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



    //ENCONTRAR ACTAS POR FECHA EXACTA
    async findAllFromDate(date: string): Promise<ActaSicPdfEntity[]> {
        const actas = await this.acta_sic_pdfRepository.createQueryBuilder('acta')
            .where('acta.act_creado = :date', { date })
            .getMany();
        if (actas.length === 0) {
            throw new NotFoundException(new MessageDto('No hay actas en esa fecha'));
        }
        return actas;
    }


    //ENCONTRAR ACTAS POR FECHA EXACTA Y/O NUMERO DE ACTA Y/O NOMBRE PRESTADOR Y/O NIT
    async findAllBusqueda(year?: number, numActa?: number, nomPresta?: string, nit?: string, tokenDto?: string): Promise<ActaSicPdfEntity[]> {
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
            let query = this.acta_sic_pdfRepository.createQueryBuilder('acta');

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
            let query = this.acta_sic_pdfRepository.createQueryBuilder('acta');

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


    /*CREACIÓN SIC ACTA PDF*/
    async create(payloads: { dto: ActaSicPdfDto, tokenDto: TokenDto }): Promise<any> {
        const { dto, tokenDto } = payloads;

        try {
            const acta_sicpdf = this.acta_sic_pdfRepository.create(dto);
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

            await this.acta_sic_pdfRepository.save(acta_sicpdf);

            const acta_ultima = await this.acta_sic_pdfRepository.createQueryBuilder('acta')
                .addSelect('acta.id')
                .orderBy('acta.act_id', 'DESC')
                .getOne();

            //CONSULTAR LA ULTIMA ACTA QUE SE ASIGNARA A LA EVALUACION
            const acta = await this.acta_sic_pdfRepository.findOne({ where: { id: acta_ultima.id } })

            //ASIGNAMOS LOS DATOS DE LA ACTA REGISTRADA PARA CONSTRUIR EL DTO DE EVALUACION-INDEPENDIENTES
            const eva_creado = acta_ultima.act_creado;  //Fecha de creación del acta
            const eva_acta_prestador = acta_ultima.act_cod_prestador; // Valor del ID del prestador

            //CONSULTAR EL PRESTADOR QUE TIENE EL ACTA
            const prestador = await this.prestadorRepository.findOne({ where: { pre_cod_habilitacion: eva_acta_prestador } })

            //ASIGNAMOS LOS DATOS AL DTO
            const evaluacionDto: EvaluacionSicDto = {
                eva_creado
            }

            //CREAMOS EL DTO
            const evaluacion_sic = await this.evaluacionSicRepository.create(evaluacionDto)

            //ASIGNACION DE FORANEA ACTA UNO A UNO
            evaluacion_sic.eval_acta_sic = acta
            //ASIGNACION DE FORANEA PRESTADOR UNO A MUCHOS
            evaluacion_sic.eval_sic_prestator = prestador

            //GUARDAMOS EN LA ENTIDAD EVALUACION-SIC DE LA BASE DATOS
            await this.evaluacionSicRepository.save(evaluacion_sic)


            //CONSULTAR LA ÚLTIMA EVALUACIÓN EXISTENTE
            const evaluacion_ultima = await this.evaluacionSicRepository.createQueryBuilder('evaluacion')
                .addSelect('evaluacion.eva_id')
                .orderBy('evaluacion.eva_id', 'DESC')
                .getOne();

            //CONSULTAR LOS DOMINIOS EXISTENTES
            const dominios = await this.dominioRepository.find()

            //evaluacion_ultima.eva_sic_dom = dominios

            //GUARDAR LA RELACIÓN ENTRE EVALUACIÓN Y ETAPAS
            await this.evaluacionSicRepository.save(evaluacion_ultima);


            //ASIGNAR LA AUDITORIA DEL ACTA CREADA
            await this.auditoria_registro_services.logCreateActaSic(
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


    //CERRAR ACTA
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

            await this.acta_sic_pdfRepository.save(acta);
            await this.auditoria_registro_services.logCierreActaSic(
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



    //ACTUALIZAR ACTA SIC
    async updateActa(id: number, payload: { dto: ActaSicPdfDto, tokenDto: TokenDto }): Promise<any> {
        const { dto, tokenDto } = payload;
        const acta = await this.findByActa(id);
        if (!acta) {
            throw new NotFoundException(new MessageDto('El Acta no existe'))
        }
        dto.act_id ? acta.act_id = dto.act_id : acta.act_id = acta.act_id;
        acta.act_visita_inicial = dto.act_visita_inicial !== undefined ? dto.act_visita_inicial : "";
        acta.act_visita_seguimiento = dto.act_visita_seguimiento !== undefined ? dto.act_visita_seguimiento : "";
        dto.act_fecha_inicial ? acta.act_fecha_inicial = dto.act_fecha_inicial : acta.act_fecha_inicial = acta.act_fecha_inicial;
        dto.act_fecha_final ? acta.act_fecha_final = dto.act_fecha_final : acta.act_fecha_final = acta.act_fecha_final;
        dto.act_municipio ? acta.act_municipio = dto.act_municipio : acta.act_municipio = acta.act_municipio;
        dto.act_prestador ? acta.act_prestador = dto.act_prestador : acta.act_prestador = acta.act_prestador;
        dto.act_nit ? acta.act_nit = dto.act_nit : acta.act_nit = acta.act_nit;
        dto.act_direccion ? acta.act_direccion = dto.act_direccion : acta.act_direccion = acta.act_direccion;
        dto.act_barrio ? acta.act_barrio = dto.act_barrio : acta.act_barrio = acta.act_barrio;
        dto.act_telefono ? acta.act_telefono = dto.act_telefono : acta.act_telefono = acta.act_telefono;
        dto.act_email ? acta.act_email = dto.act_email : acta.act_email = acta.act_email;
        acta.act_sede_principal = dto.act_sede_principal !== undefined ? dto.act_sede_principal : "";
        acta.act_sede_localidad = dto.act_sede_localidad !== undefined ? dto.act_sede_localidad : "";
        acta.act_sede_direccion = dto.act_sede_direccion !== undefined ? dto.act_sede_direccion : "";
        dto.act_representante ? acta.act_representante = dto.act_representante : acta.act_representante = acta.act_representante;
        dto.act_cod_prestador ? acta.act_cod_prestador = dto.act_cod_prestador : acta.act_cod_prestador = acta.act_cod_prestador;
        dto.act_obj_visita ? acta.act_obj_visita = dto.act_obj_visita : acta.act_obj_visita = acta.act_obj_visita;
        dto.act_nombre_funcionario ? acta.act_nombre_funcionario = dto.act_nombre_funcionario : acta.act_nombre_funcionario = acta.act_nombre_funcionario;
        dto.act_cargo_funcionario ? acta.act_cargo_funcionario = dto.act_cargo_funcionario : acta.act_cargo_funcionario = acta.act_cargo_funcionario;
        dto.act_firma_funcionario ? acta.act_firma_funcionario = dto.act_firma_funcionario : acta.act_firma_funcionario = acta.act_firma_funcionario;
        dto.act_nombre_prestador ? acta.act_nombre_prestador = dto.act_nombre_prestador : acta.act_nombre_prestador = acta.act_nombre_prestador;
        dto.act_cargo_prestador ? acta.act_cargo_prestador = dto.act_cargo_prestador : acta.act_cargo_prestador = acta.act_cargo_prestador;
        dto.act_firma_prestador ? acta.act_firma_prestador = dto.act_firma_prestador : acta.act_firma_prestador = acta.act_firma_prestador;
        dto.noFirmaActa ? acta.noFirmaActa = dto.noFirmaActa : acta.noFirmaActa = acta.noFirmaActa = acta.noFirmaActa;


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

        await this.acta_sic_pdfRepository.save(acta);
        await this.auditoria_actualizacion_service.logUpdateActaSic(
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


    async generarPdfEvaluacionSic(id: number): Promise<Buffer> {

        const cumplimientoestandar = await this.cumplimientosicService.getcumpliestandar(id);
        const cumplimiento = await this.cumplimientosicService.getCriCalIdeva(id);


        let totalCalificacionesEtapa1 = 0
        let totalCalificacionesCountEtapa1 = 0; // Contador para la cantidad total de calificaciones

        let nombreprestador = "";
        let cargoprestador = "";
        let nombrefuncionario = "";
        let cargofuncionario = "";
        let nombreindicador = "";
        let codigoindicador = "";

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
            doc.text('', 90, 110);
            doc.font('Helvetica-Bold').fontSize(14);
            doc.text('CUMPLIMIENTO DEL PROGRAMA DE SEGURIDAD DEL PACIENTE');
            doc.text('', 185, 130);
            doc.font('Helvetica-Bold').fontSize(14);
            doc.text('PROFESIONALES INDEPENDIENTES');
            // doc.moveDown();
            // doc.font('Helvetica').fontSize(14);

            doc.text('', 50, 110);
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();
            // doc.moveDown();
            // doc.moveDown();
            // doc.moveDown();

            // doc.fontSize(24);
            function hayEspacioSuficiente(alturaContenido: number) {
                const margenInferior = doc.page.margins.bottom;
                const alturaPagina = doc.page.height;
                const espacioRestante = alturaPagina - margenInferior - alturaContenido;
                return espacioRestante >= 0;
            }

            cumplimiento.forEach(prestador => {
                nombreprestador = prestador.cump_eva_sic.eval_acta_sic.act_nombre_prestador;
                nombrefuncionario = prestador.cump_eva_sic.eval_acta_sic.act_nombre_funcionario;
                cargoprestador = prestador.cump_eva_sic.eval_acta_sic.act_cargo_prestador;
                cargofuncionario = prestador.cump_eva_sic.eval_acta_sic.act_cargo_funcionario;
                nombreindicador = prestador.indicadorsic.ind_nombre;
                codigoindicador = prestador.indicadorsic.ind_id;
            })


            if (cumplimientoestandar.length) {
                let rows_elements = [];

                let idCounter = 1; // Inicializa un contador
                cumplimientoestandar.forEach(item => {
                    var temp_list = [idCounter, item.criterioestandar_sic.crie_nombre, item.cumpl_cumple, item.cumpl_observaciones];
                    rows_elements.push(temp_list)
                    idCounter++;
                })

                const tableOptions = {
                    columnsSize: [10, 210, 102, 210],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };
                const table = {
                    //title: "COMPROMISO DEL PROFESIONAL INDEPENDIENTE CON LA ATENCION  SEGURA DEL PACIENTE",
                    headers: ["N°", "CRITERIOS", "CUMPLIMIENTO", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Verificar si hay suficiente espacio en la página actual para la tabla
                if (!hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
                    doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
                    pageNumber++; // Incrementar el número de página
                }

                doc.table(table, tableOptions);
                // Calcular el promedio
                const promedio = totalCalificacionesEtapa1 / totalCalificacionesCountEtapa1;
                const promedioRedondeado = promedio.toFixed(2);

            }


            doc.text(nombreprestador)

            // Agregar las tablas a las páginas
            if (cumplimiento.length) {
                let rows_elements = [];

                let idCounter = 1; // Inicializa un contador
                cumplimiento.forEach(item => {
                    var temp_list = [idCounter, item.criterio_sic.cri_nombre, item.cumpl_cumple, item.cumpl_observaciones];
                    rows_elements.push(temp_list)
                    idCounter++;
                })

                const tableOptions = {
                    columnsSize: [10, 210, 102, 210],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };
                const table = {
                    title: `NOMBRE: ${nombreindicador}`,
                    subtitle: `CODIGO: ${codigoindicador}`,
                    headers: ["N°", "CRITERIOS", "CUMPLIMIENTO", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Verificar si hay suficiente espacio en la página actual para la tabla
                if (!hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
                    doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
                    pageNumber++; // Incrementar el número de página
                }

                doc.table(table, tableOptions);


            }

            // doc.addPage();

            // if (titulo_dos.length) {
            //     let rows_elements = [];
            //     titulo_dos.forEach(item => {
            //         var temp_list = [item.criterio_cal.cri_id, item.criterio_cal.cri_nombre, item.cal_nota, item.criterio_cal.cri_verificacion, item.cal_observaciones];
            //         rows_elements.push(temp_list)
            //     })

            //     const tableOptions = {
            //         columnsSize: [10, 210, 72, 65, 175],
            //         headerAlign: 'center',
            //         align: 'center',
            //         rowHeight: 15,
            //     };
            //     const table2 = {
            //         title: "CONOCIMIENTOS BÁSICOS DE LA SEGURIDAD DEL PACIENTE",
            //         headers: ["", "CRITERIOS", "CALIFICACION", "VERIFICACION", "OBSERVACIONES"],
            //         rows: rows_elements
            //     };
            //     // Verificar si hay suficiente espacio en la página actual para la tabla
            //     if (!hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
            //         doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
            //         pageNumber++; // Incrementar el número de página
            //     }
            //     doc.moveDown();
            //     doc.table(table2, tableOptions);
            // }

            // // doc.moveDown();
            // // doc.moveDown();

            // if (titulo_tres.length) {
            //     let rows_elements = [];
            //     titulo_tres.forEach(item => {
            //         var temp_list = [item.criterio_cal.cri_id, item.criterio_cal.cri_nombre, item.cal_nota, item.criterio_cal.cri_verificacion, item.cal_observaciones];
            //         rows_elements.push(temp_list)
            //     })

            //     const tableOptions = {
            //         columnsSize: [10, 210, 72, 65, 175],
            //         headerAlign: 'center',
            //         align: 'center',
            //         rowHeight: 15,
            //     };
            //     const table3 = {
            //         title: "REGISTRO DE FALLAS EN LA ATENCIÓN EN SALUD y PLAN DE MEJORAMIENTO",
            //         headers: ["", "CRITERIOS", "CALIFICACION", "VERIFICACION", "OBSERVACIONES"],
            //         rows: rows_elements
            //     };
            //     doc.moveDown();
            //     // Verificar si hay suficiente espacio en la página actual para la tabla
            //     if (!hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
            //         doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
            //         pageNumber++; // Incrementar el número de página
            //     }
            //     doc.table(table3, tableOptions);
            // }

            // // doc.moveDown();
            // // doc.moveDown();

            // if (titulo_cuatro.length) {
            //     let rows_elements = [];
            //     titulo_cuatro.forEach(item => {
            //         var temp_list = [item.criterio_cal.cri_id, item.criterio_cal.cri_nombre, item.cal_nota, item.criterio_cal.cri_verificacion, item.cal_observaciones];
            //         rows_elements.push(temp_list)
            //     })

            //     const tableOptions = {
            //         columnsSize: [10, 210, 72, 65, 175],
            //         headerAlign: 'center',
            //         align: 'center',
            //         rowHeight: 15,
            //     };
            //     const table4 = {
            //         title: "DETECCIÓN, PREVENCIÓN Y CONTROL DE INFECCIONES ASOCIADAS AL CUIDADO",
            //         headers: ["", "CRITERIOS", "CALIFICACION", "VERIFICACION", "OBSERVACIONES"],
            //         rows: rows_elements
            //     };
            //     doc.moveDown();
            //     // Verificar si hay suficiente espacio en la página actual para la tabla
            //     if (!hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
            //         doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
            //         pageNumber++; // Incrementar el número de página
            //     }
            //     doc.table(table4, tableOptions);
            // }

            doc.moveDown();

            const tableOptions2 = {
                columnsSize: [450],
                headerAlign: 'center',
                align: 'center',
                rowHeight: 15,
            };

            const tableprestador = {
                headers: ["SECRETARIA DE SALUD DEPARTAMENTAL"],
                rows: [[`NOMBRE: ${nombreprestador}`],
                [`CARGO: ${cargoprestador}`],
                ["FIRMA"]]
            };


            doc.moveDown();

            doc.table(tableprestador, tableOptions2);

            doc.moveDown();

            const tableOptions3 = {
                columnsSize: [450],
                headerAlign: 'center',
                align: 'center',
                rowHeight: 15,
            };

            const tablefuncionario = {
                headers: ["SECRETARIA DE SALUD DEPARTAMENTAL"],
                rows: [[`NOMBRE: ${nombrefuncionario}`],
                [`CARGO: ${cargofuncionario}`],
                ["FIRMA"]]
            };


            doc.moveDown();

            doc.table(tablefuncionario, tableOptions3);

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


    // async generarPdfEvaluacionSic(id: number): Promise<Buffer> {

    //     const cumplimientoestandar = await this.cumplimientosicService.getcumpliestandar(id);
    //     const cumplimiento = await this.cumplimientosicService.getCriCalIdeva(id);


    //     let totalCalificacionesEtapa1 = 0
    //     let totalCalificacionesCountEtapa1 = 0; // Contador para la cantidad total de calificaciones

    //     let nombreprestador = "";
    //     let cargoprestador = "";
    //     let nombrefuncionario = "";
    //     let cargofuncionario = "";
    //     let nombreindicador = "";
    //     let codigoindicador = "";

    //     const pdfBuffer: Buffer = await new Promise(resolve => {
    //         const doc = new PDFDocument({
    //             size: 'LETTER',
    //             bufferPages: true,
    //             autoFirstPage: false,
    //         });

    //         let pageNumber = 0;

    //         doc.on('pageAdded', () => {
    //             pageNumber++;
    //             let bottom = doc.page.margins.bottom;

    //             doc.image(join(process.cwd(), "src/uploads/EncabezadoEvaluacionSic.png"), doc.page.width - 550, 20, { fit: [500, 500], align: 'center' })
    //             doc.moveDown()

    //             doc.page.margins.top = 115;
    //             doc.page.margins.bottom = 0;
    //             doc.font("Helvetica").fontSize(14);
    //             doc.text(
    //                 'Pág. ' + pageNumber,
    //                 0.5 * (doc.page.width - 100),
    //                 doc.page.height - 50,
    //                 {
    //                     width: 100,
    //                     align: 'center',
    //                     lineBreak: false,
    //                 }
    //             );
    //             doc.page.margins.bottom = bottom;

    //         });

    //         doc.addPage();
    //         doc.text('', 90, 110);
    //         doc.font('Helvetica-Bold').fontSize(14);
    //         doc.text('CUMPLIMIENTO DEL PROGRAMA DE SEGURIDAD DEL PACIENTE');
    //         doc.text('', 185, 130);
    //         doc.font('Helvetica-Bold').fontSize(14);
    //         doc.text('PROFESIONALES INDEPENDIENTES');
    //         // doc.moveDown();
    //         // doc.font('Helvetica').fontSize(14);

    //         doc.text('', 50, 110);
    //         doc.moveDown();
    //         doc.moveDown();
    //         doc.moveDown();
    //         doc.moveDown();
    //         // doc.moveDown();
    //         // doc.moveDown();
    //         // doc.moveDown();

    //         // doc.fontSize(24);
    //         function hayEspacioSuficiente(alturaContenido: number) {
    //             const margenInferior = doc.page.margins.bottom;
    //             const alturaPagina = doc.page.height;
    //             const espacioRestante = alturaPagina - margenInferior - alturaContenido;
    //             return espacioRestante >= 0;
    //         }

    //         cumplimiento.forEach(prestador => {
    //             nombreprestador = prestador.cump_eva_sic.eval_acta_sic.act_nombre_prestador;
    //             nombrefuncionario = prestador.cump_eva_sic.eval_acta_sic.act_nombre_funcionario;
    //             cargoprestador = prestador.cump_eva_sic.eval_acta_sic.act_cargo_prestador;
    //             cargofuncionario = prestador.cump_eva_sic.eval_acta_sic.act_cargo_funcionario;
    //             nombreindicador = prestador.indicadorsic.ind_nombre;
    //             codigoindicador = prestador.indicadorsic.ind_id;
    //         })


    //         // if (cumplimientoestandar.length) {
    //         //     let rows_elements = [];

    //         //     cumplimientoestandar.forEach(item => {
    //         //         var temp_list = [item.criterioestandar_sic.crie_id, item.criterioestandar_sic.crie_nombre, item.cumpl_cumple, item.cumpl_observaciones];
    //         //         rows_elements.push(temp_list)
    //         //     })

    //         //     const tableOptions = {
    //         //         columnsSize: [10, 210, 102, 210],
    //         //         headerAlign: 'center',
    //         //         align: 'center',
    //         //         rowHeight: 15,
    //         //     };
    //         //     const table = {
    //         //         //title: "COMPROMISO DEL PROFESIONAL INDEPENDIENTE CON LA ATENCION  SEGURA DEL PACIENTE",
    //         //         headers: ["N°", "CRITERIOS", "CUMPLIMIENTO", "OBSERVACIONES"],
    //         //         rows: rows_elements
    //         //     };

    //         //     // Verificar si hay suficiente espacio en la página actual para la tabla
    //         //     if (!hayEspacioSuficiente(tableOptions.rowHeight * rows_elements.length)) {
    //         //         doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
    //         //         pageNumber++; // Incrementar el número de página
    //         //     }

    //         //     doc.table(table, tableOptions);
    //         //     // Calcular el promedio
    //         //     const promedio = totalCalificacionesEtapa1 / totalCalificacionesCountEtapa1;
    //         //     const promedioRedondeado = promedio.toFixed(2);

    //         //     doc.text(`Calificación Promedio: ${promedioRedondeado}`);
    //         // }


    //         doc.text(nombreprestador)
    //         // Agregar las tablas a las páginas
    //         if (cumplimiento.length) {
    //             let rows_elements = [];
    //             const tableOptions = {
    //                 columnsSize: [10, 210, 102, 210],
    //                 headerAlign: 'center',
    //                 align: 'center',
    //                 rowHeight: 15,
    //             };
    //             let pageNumber = 1; // Inicializa el número de página
    //             let currentIndicador = null; // Para realizar un seguimiento del indicador actual

    //             cumplimiento.forEach((item, index) => {
    //                 var temp_list =  [item.criterio_sic.cri_id, item.criterio_sic.cri_nombre, item.cumpl_cumple, item.cumpl_observaciones];
    //                 rows_elements.push(temp_list)
    //                 if (index > 0) {
    //                     // Verificar si hay suficiente espacio en la página actual para la tabla
    //                     if (!hayEspacioSuficiente(tableOptions.rowHeight)) {
    //                         doc.addPage(); // Agregar una nueva página si no hay suficiente espacio
    //                         pageNumber++; // Incrementar el número de página
    //                     }
    //                 }

    //                 if (item.indicadorsic.ind_nombre !== currentIndicador) {
    //                     // Si el indicador actual es diferente al anterior, crear una nueva tabla
    //                     if (currentIndicador !== null) {
    //                         doc.moveDown(); // Finalizar la tabla anterior
    //                     }

    //                     currentIndicador = item.indicadorsic.ind_nombre;

    //                     // Configurar la nueva tabla
    //                     doc.table(
    //                         {
    //                             title: `NOMBRE: ${nombreindicador}`,
    //                             subtitle: `CODIGO: ${codigoindicador}`,
    //                             headers: ["N°", "CRITERIOS", "CUMPLIMIENTO", "OBSERVACIONES"],
    //                             rows: rows_elements
    //                         },
    //                         tableOptions
    //                     );
    //                 }

    //                 // Agregar una fila a la tabla actual


    //             });



    //         }



    //         doc.moveDown();

    //         const tableOptions2 = {
    //             columnsSize: [450],
    //             headerAlign: 'center',
    //             align: 'center',
    //             rowHeight: 15,
    //         };

    //         const tableprestador = {
    //             headers: ["SECRETARIA DE SALUD DEPARTAMENTAL"],
    //             rows: [[`NOMBRE: ${nombreprestador}`],
    //             [`CARGO: ${cargoprestador}`],
    //             ["FIRMA"]]
    //         };


    //         doc.moveDown();

    //         doc.table(tableprestador, tableOptions2);

    //         doc.moveDown();

    //         const tableOptions3 = {
    //             columnsSize: [450],
    //             headerAlign: 'center',
    //             align: 'center',
    //             rowHeight: 15,
    //         };

    //         const tablefuncionario = {
    //             headers: ["SECRETARIA DE SALUD DEPARTAMENTAL"],
    //             rows: [[`NOMBRE: ${nombrefuncionario}`],
    //             [`CARGO: ${cargofuncionario}`],
    //             ["FIRMA"]]
    //         };


    //         doc.moveDown();

    //         doc.table(tablefuncionario, tableOptions3);

    //         const buffer = [];
    //         doc.on('data', buffer.push.bind(buffer));
    //         doc.on('end', () => {
    //             const data = Buffer.concat(buffer);
    //             resolve(data);
    //         });

    //         doc.end();
    //     });

    //     return pdfBuffer;
    // }

}
