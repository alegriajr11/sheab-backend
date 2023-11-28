import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActaSpIndependientePdfEntity } from './sp-ind-acta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActaSpIndependientePdfRepository } from './sp-ind-acta.repository';
import { MessageDto } from 'src/common/message.dto';
import { IndActaDto } from 'src/generarpdf/sp/dto/sp-ind-acta.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { EvaluacionIndependientesRepository } from 'src/sp/sp_ind/evaluacion-independientes.repository';
import { EvaluacionIndependientesEntity } from 'src/sp/sp_ind/evaluacion-independientes.entity';
import { EvaluacionIndependientesDto } from 'src/sp/sp_ind/dto/evaluacion-independientes.dto';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { PrestadorRepository } from 'src/prestador/prestador.repository';
import { EtapaInd } from 'src/sp/sp_ind/etapaind.entity';
import { EtapaIndRepository } from 'src/sp/sp_ind/etapaind.repository';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { CalificacionindService } from 'src/sp/sp_ind/calificacionind/calificacionind.service';
import { join } from 'path';
import { EvaluacionIndService } from 'src/sp/sp_ind/evaluacion-ind/evaluacion-ind.service';

const PDFDocument = require('pdfkit-table')

@Injectable()
export class SpIndependientesService {
    constructor(
        @InjectRepository(ActaSpIndependientePdfEntity)
        private readonly actaSpIndependientePdfRepository: ActaSpIndependientePdfRepository,
        @InjectRepository(EvaluacionIndependientesEntity)
        private readonly evaluacionIndependientesRepository: EvaluacionIndependientesRepository,
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
        @InjectRepository(EtapaInd)
        private readonly etapaIndependientesRepository: EtapaIndRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        @Inject(CalificacionindService)
        private readonly calificacionindService: CalificacionindService,
        @Inject(EvaluacionIndService)
        private readonly evaluacionIndService: EvaluacionIndService,
    ) { }

    //LISTAR TODAS LAS ACTAS SP INDEPENDIENTE
    async getallActas(tokenDto: string): Promise<ActaSpIndependientePdfEntity[]> {
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
            const acta = await this.actaSpIndependientePdfRepository.createQueryBuilder('acta')
                .select(['acta'])
                .where('acta.act_id_funcionario = :id_funcionario', { id_funcionario: payloadInterface.usu_id })
                .orderBy("CASE WHEN acta.act_estado = '1' THEN 0 ELSE 1 END, acta.act_estado")
                .getMany()
            if (acta.length === 0) throw new NotFoundException(new MessageDto('No tienes evaluaciones asignadas'))
            return acta;
        } else {
            const acta = await this.actaSpIndependientePdfRepository.createQueryBuilder('acta')
                .select(['acta'])
                .orderBy("CASE WHEN acta.act_estado = '1' THEN 0 ELSE 1 END, acta.act_estado")
                .getMany()
            if (acta.length === 0) throw new NotFoundException(new MessageDto('No hay evaluaciones asignadas'))
            return acta;
        }
    }

    //ENCONTRAR POR ACTA
    async findByActa(id: number): Promise<ActaSpIndependientePdfEntity> {
        const indep = await this.actaSpIndependientePdfRepository.findOne({ where: { id } });
        if (!indep) {
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return indep;
    }


    //ENCONTRAR ACTA POR FECHAS
    async findAllFromDate(date: string): Promise<ActaSpIndependientePdfEntity[]> {

        const actas = await this.actaSpIndependientePdfRepository.createQueryBuilder('acta')
            .where('acta.act_creado = :date', { date })
            .getMany();
        if (actas.length === 0) {
            throw new NotFoundException(new MessageDto('No hay Actas en esa fecha'));
        }

        return actas;
    }


    //ENCONTRAR ACTAS POR FECHA EXACTA Y/O NUMERO DE ACTA Y/O NOMBRE PRESTADOR Y/O NIT
    async findAllBusqueda(year?: number, numActa?: number, nomPresta?: string, nit?: string, tokenDto?: string): Promise<ActaSpIndependientePdfEntity[]> {

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
            let query = this.actaSpIndependientePdfRepository.createQueryBuilder('acta');

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
            let query = this.actaSpIndependientePdfRepository.createQueryBuilder('acta');

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


    /*CREACIÓN SP INDEPENDIENTE ACTA PDF */
    async create(payloads: { dto: IndActaDto, tokenDto: TokenDto }): Promise<any> {
        const { dto, tokenDto } = payloads;

        try {
            const acta_sicpdf = this.actaSpIndependientePdfRepository.create(dto);
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

            await this.actaSpIndependientePdfRepository.save(acta_sicpdf);

            const acta_ultima = await this.actaSpIndependientePdfRepository.createQueryBuilder('acta')
                .addSelect('acta.id')
                .orderBy('acta.act_id', 'DESC')
                .getOne();

            //CONSULTAR LA ULTIMA ACTA QUE SE ASIGNARA A LA EVALUACION
            const acta = await this.actaSpIndependientePdfRepository.findOne({ where: { id: acta_ultima.id } })

            //ASIGNAMOS LOS DATOS DE LA ACTA REGISTRADA PARA CONSTRUIR EL DTO DE EVALUACION-INDEPENDIENTES
            const eva_creado = acta_ultima.act_creado;  //Fecha de creación del acta
            const eva_acta_prestador = acta_ultima.act_cod_prestador; // Valor del ID del prestador

            //CONSULTAR EL PRESTADOR QUE TIENE EL ACTA
            const prestador = await this.prestadorRepository.findOne({ where: { pre_cod_habilitacion: eva_acta_prestador } })

            //ASIGNAMOS LOS DATOS AL DTO
            const evaluacionDto: EvaluacionIndependientesDto = {
                eva_creado
            }

            //CREAMOS EL DTO
            const evaluacion_ind = await this.evaluacionIndependientesRepository.create(evaluacionDto)

            //ASIGNACION DE FORANEA ACTA UNO A UNO
            evaluacion_ind.eval_acta_ind = acta
            //ASIGNACION DE FORANEA PRESTADOR UNO A MUCHOS
            evaluacion_ind.eval_prestador = prestador

            //GUARDAMOS EN LA ENTIDAD EVALUACION-INDEPENDIENTES DE LA BASE DATOS
            await this.evaluacionIndependientesRepository.save(evaluacion_ind)

            //CONSULTAR LA ÚLTIMA EVALUACIÓN EXISTENTE
            const evaluacion_ultima = await this.evaluacionIndependientesRepository.createQueryBuilder('evaluacion')
                .addSelect('evaluacion.eva_id')
                .orderBy('evaluacion.eva_id', 'DESC')
                .getOne();

            //GUARDAR LA RELACIÓN ENTRE EVALUACIÓN Y ETAPAS
            await this.evaluacionIndependientesRepository.save(evaluacion_ultima);

            //ASIGNAR LA AUDITORIA DEL ACTA CREADA
            await this.auditoria_registro_services.logCreateActaSpIndep(
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

            await this.actaSpIndependientePdfRepository.save(acta);
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


    //ACTUALIZAR CRITERIOS SP INDEPENDIENTE
    async updateActaInd(id: number, payload: { dto: IndActaDto, tokenDto: TokenDto }): Promise<any> {
        const { dto, tokenDto } = payload;
        const acta_ind = await this.findByActa(id);
        if (!acta_ind) {
            throw new NotFoundException(new MessageDto('El Acta no existe'))
        }
        dto.act_id ? acta_ind.act_id = dto.act_id : acta_ind.act_id = acta_ind.act_id;
        acta_ind.act_visita_inicial = dto.act_visita_inicial !== undefined ? dto.act_visita_inicial : "";
        acta_ind.act_visita_seguimiento = dto.act_visita_seguimiento !== undefined ? dto.act_visita_seguimiento : "";
        dto.act_fecha_inicial ? acta_ind.act_fecha_inicial = dto.act_fecha_inicial : acta_ind.act_fecha_inicial = acta_ind.act_fecha_inicial;
        dto.act_fecha_final ? acta_ind.act_fecha_final = dto.act_fecha_final : acta_ind.act_fecha_final = acta_ind.act_fecha_final;
        dto.act_municipio ? acta_ind.act_municipio = dto.act_municipio : acta_ind.act_municipio = acta_ind.act_municipio;
        dto.act_prestador ? acta_ind.act_prestador = dto.act_prestador : acta_ind.act_prestador = acta_ind.act_prestador;
        dto.act_nit ? acta_ind.act_nit = dto.act_nit : acta_ind.act_nit = acta_ind.act_nit;
        dto.act_direccion ? acta_ind.act_direccion = dto.act_direccion : acta_ind.act_direccion = acta_ind.act_direccion;
        dto.act_barrio ? acta_ind.act_barrio = dto.act_barrio : acta_ind.act_barrio = acta_ind.act_barrio;
        dto.act_telefono ? acta_ind.act_telefono = dto.act_telefono : acta_ind.act_telefono = acta_ind.act_telefono;
        dto.act_email ? acta_ind.act_email = dto.act_email : acta_ind.act_email = acta_ind.act_email;
        dto.act_representante ? acta_ind.act_representante = dto.act_representante : acta_ind.act_representante = acta_ind.act_representante;
        dto.act_cod_prestador ? acta_ind.act_cod_prestador = dto.act_cod_prestador : acta_ind.act_cod_prestador = acta_ind.act_cod_prestador;
        dto.act_obj_visita ? acta_ind.act_obj_visita = dto.act_obj_visita : acta_ind.act_obj_visita = acta_ind.act_obj_visita;
        dto.act_nombre_funcionario ? acta_ind.act_nombre_funcionario = dto.act_nombre_funcionario : acta_ind.act_nombre_funcionario = acta_ind.act_nombre_funcionario;
        dto.act_cargo_funcionario ? acta_ind.act_cargo_funcionario = dto.act_cargo_funcionario : acta_ind.act_cargo_funcionario = acta_ind.act_cargo_funcionario;
        dto.act_nombre_prestador ? acta_ind.act_nombre_prestador = dto.act_nombre_prestador : acta_ind.act_nombre_prestador = acta_ind.act_nombre_prestador;
        dto.act_cargo_prestador ? acta_ind.act_cargo_prestador = dto.act_cargo_prestador : acta_ind.act_cargo_prestador = acta_ind.act_cargo_prestador;
        dto.act_firma_prestador ? acta_ind.act_firma_prestador = dto.act_firma_prestador : acta_ind.act_firma_prestador = acta_ind.act_firma_prestador;
        dto.act_firma_funcionario ? acta_ind.act_firma_funcionario = dto.act_firma_funcionario : acta_ind.act_firma_funcionario = acta_ind.act_firma_funcionario;
        dto.noFirmaActa ? acta_ind.noFirmaActa = dto.noFirmaActa : acta_ind.noFirmaActa = acta_ind.noFirmaActa = acta_ind.noFirmaActa;

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

        await this.actaSpIndependientePdfRepository.save(acta_ind);
        await this.auditoria_actualizacion_services.logUpdateActaSpIndep(
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

    //ÚLTIMA ACTA REGISTRADA
    async getLastestActa(): Promise<ActaSpIndependientePdfEntity> {
        const anioActual: number = new Date().getFullYear();

        const acta = await this.actaSpIndependientePdfRepository.createQueryBuilder('acta')
            .addSelect('acta.act_id')
            .orderBy('acta.act_id', 'DESC')
            .getOne();

        if (!acta) {
            const newActa: ActaSpIndependientePdfEntity = new ActaSpIndependientePdfEntity();
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

    //GENERACIÓN DE REPORTE DE CALIFICACIONES DEL PROGRAMA DE SEGURIDAD DEL PACIENTE PROFESIONALES INDEPENDIENTES
    //Metodo para generar el PDF con las tablas ajustadas
    async generarPdfEvaluacionInd(id: number): Promise<Buffer> {

        const titulo_uno = await this.calificacionindService.getallcriterioetapa(id);
        const titulo_dos = await this.calificacionindService.getallcriterioxtitulodos(id);
        const titulo_tres = await this.calificacionindService.getallcriterioxtitulotres(id);
        const titulo_cuatro = await this.calificacionindService.getallcriterioxtitulocuatro(id);
        const acta = await this.evaluacionIndService.getallEvaActa(id);


        let nombreprestador = "";
        let prestadorPrincipal = "";
        let cargoprestador = "";
        let nombrefuncionario = "";
        let cargofuncionario = "";

        let totalCalificacionesEtapa1 = 0
        let totalCalificacionesCountEtapa1 = 0; // Contador para la cantidad total de calificaciones
        let totalCalificacionesEtapa2 = 0
        let totalCalificacionesCountEtapa2 = 0; // Contador para la cantidad total de calificaciones
        let totalCalificacionesEtapa3 = 0
        let totalCalificacionesCountEtapa3 = 0; // Contador para la cantidad total de calificaciones
        let totalCalificacionesEtapa4 = 0
        let totalCalificacionesCountEtapa4 = 0; // Contador para la cantidad total de calificaciones

        let promedio = 0;
        let promedio2 = 0;
        let promedio3 = 0;
        let promedio4 = 0;
        let contador = 0;
        let total = 0;
        let promedio_total = 0;

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

                //ASIGNAR NOMBRES DEL PRESTADOR Y FUNCIONARIO EN EL PDF
                acta.forEach(acta => {
                    prestadorPrincipal = acta.eval_acta_ind.act_prestador;
                    nombreprestador = acta.eval_acta_ind.act_nombre_prestador;
                    nombrefuncionario = acta.eval_acta_ind.act_nombre_funcionario;
                    cargoprestador = acta.eval_acta_ind.act_cargo_prestador;
                    cargofuncionario = acta.eval_acta_ind.act_cargo_funcionario;
                })


                doc.image(join(process.cwd(), "src/uploads/encabezados/EncabezadoEvaluacionSPInd.png"), doc.page.width - 550, 20, { fit: [500, 500], align: 'center' })
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
            doc.text('', 90, 90);
            doc.font('Helvetica-Bold').fontSize(14);
            doc.text('CUMPLIMIENTO DEL PROGRAMA DE SEGURIDAD DEL PACIENTE');
            doc.text('', 185, 110);
            doc.text('PROFESIONALES INDEPENDIENTES');

            doc.text('PRESTADOR: ', 260, 140);
            // Obtener la longitud del texto
            const textWidth = doc.widthOfString(prestadorPrincipal);

            // Coordenadas del Prestador Principal
            let x = 185;
            //ESTABLECER CORDENADAS DE X DEPENDIENDO EL TAMAÑO DE textWidth
            if (textWidth > 290) {
                x = 160
            } else if (textWidth <= 264 && textWidth >= 237) {
                x = 170
            } else if (textWidth <= 183) {
                x = 212
            }

            let y = 160;
            doc.moveDown();
            doc.text(prestadorPrincipal, x, y)


            // Calcular las coordenadas para el subrayado
            const underlineY = y + 12; //Posición vertical de la linea
            const underlineX1 = x;
            const underlineX2 = x + textWidth;
            // Dibujar el subrayado
            doc.moveTo(underlineX1, underlineY)
                .lineTo(underlineX2, underlineY)
                .lineWidth(1) // Grosor del subrayado
                .stroke();


            //DAR INICIO A LA TABLA DESDE LA POSICIÓN X = 50
            doc.text('', 50, 110);
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();

            function hayEspacioSuficiente(alturaContenido: number) {
                const margenInferior = doc.page.margins.bottom;
                const alturaPagina = doc.page.height;
                const espacioRestante = alturaPagina - margenInferior - alturaContenido;
                return espacioRestante >= 0;
            }



            // Agregar las tablas a las páginas
            if (titulo_uno.length) {
                let rows_elements = [];

                titulo_uno.forEach(item => {
                    totalCalificacionesEtapa1 += item.cal_nota
                    totalCalificacionesCountEtapa1++; // Incrementar el contador


                    var temp_list = [item.criterio_cal.cri_id, item.criterio_cal.cri_nombre, '            ' + item.cal_nota, item.criterio_cal.cri_verificacion,
                    item.cal_observaciones === null ? '' : item.cal_observaciones // Verificar si cal_observaciones es nulo
                    ];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [10, 210, 72, 65, 175],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };


                const table = {
                    title: { label: 'COMPROMISO DEL PROFESIONAL INDEPENDIENTE CON LA ATENCION SEGURA DEL PACIENTE', color: '#050949' },
                    headers: ["", "CRITERIOS", "CALIFICACIÓN", "VERIFICACIÓN", "OBSERVACIONES"],
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
                        // Agregar la sección a la nueva página
                        doc.table({
                            title: table.title,
                            headers: table.headers,
                            rows: section
                        }, tableOptions);
                    }
                });

                // Calcular el promedio
                promedio = totalCalificacionesEtapa1 / totalCalificacionesCountEtapa1;
            }


            //SEGUNDA ETAPA
            if (titulo_dos.length) {
                let rows_elements = [];
                titulo_dos.forEach(item => {
                    totalCalificacionesEtapa2 += item.cal_nota
                    totalCalificacionesCountEtapa2++; // Incrementar el contador

                    var temp_list = [item.criterio_cal.cri_id, item.criterio_cal.cri_nombre, '            ' + item.cal_nota, item.criterio_cal.cri_verificacion,
                    item.cal_observaciones === null ? '' : item.cal_observaciones // Verificar si cal_observaciones es nulo
                    ];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [10, 210, 72, 65, 175],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };
                const table2 = {
                    title: { label: 'CONOCIMIENTOS BÁSICOS DE LA SEGURIDAD DEL PACIENTE', color: '#050949' },
                    headers: ["", "CRITERIOS", "CALIFICACION", "VERIFICACION", "OBSERVACIONES"],
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
                promedio2 = totalCalificacionesEtapa2 / totalCalificacionesCountEtapa2;
            }


            //TERCERA ETAPA
            if (titulo_tres.length) {
                let rows_elements = [];
                titulo_tres.forEach(item => {
                    totalCalificacionesEtapa3 += item.cal_nota
                    totalCalificacionesCountEtapa3++; // Incrementar el contador

                    var temp_list = [item.criterio_cal.cri_id, item.criterio_cal.cri_nombre, '            ' + item.cal_nota, item.criterio_cal.cri_verificacion,
                    item.cal_observaciones === null ? '' : item.cal_observaciones // Verificar si cal_observaciones es nulo
                    ];
                    rows_elements.push(temp_list)
                })

                const tableOptions = {
                    columnsSize: [10, 210, 72, 65, 175],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };
                const table3 = {
                    title: { label: 'REGISTRO DE FALLAS EN LA ATENCIÓN EN SALUD y PLAN DE MEJORAMIENTO', color: '#050949' },
                    headers: ["", "CRITERIOS", "CALIFICACION", "VERIFICACION", "OBSERVACIONES"],
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
                promedio3 = totalCalificacionesEtapa3 / totalCalificacionesCountEtapa3;
            }


            if (titulo_cuatro.length) {
                let rows_elements = [];
                titulo_cuatro.forEach(item => {
                    totalCalificacionesEtapa4 += item.cal_nota;
                    totalCalificacionesCountEtapa4++; // Incrementar el contador

                    var temp_list = [item.criterio_cal.cri_id, item.criterio_cal.cri_nombre, '            ' + item.cal_nota, item.criterio_cal.cri_verificacion,
                    item.cal_observaciones === null ? '' : item.cal_observaciones // Verificar si cal_observaciones es nulo
                    ];
                    rows_elements.push(temp_list);

                });

                const tableOptions = {
                    columnsSize: [10, 210, 72, 65, 175],
                    headerAlign: 'center',
                    align: 'center',
                    rowHeight: 15,
                };
                const table4 = {
                    title: { label: 'DETECCIÓN, PREVENCIÓN Y CONTROL DE INFECCIONES ASOCIADAS AL CUIDADO', color: '#050949' },
                    headers: ["", "CRITERIOS", "CALIFICACION", "VERIFICACION", "OBSERVACIONES"],
                    rows: rows_elements
                };

                // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
                const chunkSize = 10;
                const chunks = [];
                for (let i = 0; i < rows_elements.length; i += chunkSize) {
                    chunks.push(rows_elements.slice(i, i + chunkSize));
                }

                // Iterar a través de las secciones y agregarlas al documento
                chunks.forEach((section, index) => {
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
                promedio4 = totalCalificacionesEtapa4 / totalCalificacionesCountEtapa4;

            }
            //verifica si las tablas tienen datos
            if (promedio > 0) {
                total += promedio
                contador += 1
            }
            if (promedio2 > 0) {
                total += promedio2
                contador += 1
            }

            if (promedio3 > 0) {
                total += promedio3
                contador += 1
            }

            if (promedio4 > 0) {
                total += promedio4
                contador += 1
            }

            // Calcula el promedio solo si hay promedios mayores que 0
            if (contador > 0) {
                promedio_total = total / contador
            } else {
                promedio_total = 0
            }

            // Tabla "RANGO DE IMPLEMENTACION"
            const tableOptions = {
                columnsSize: [400, 50],
                headerAlign: 'center',
                align: 'center',
                rowHeight: 15,
            };


            //total = ((promedio + promedio2 + promedio3 + promedio4) / 4)
            const tablecount = {
                title: "RANGO DE IMPLEMENTACION",
                headers: ["CRITERIOS", "TOTAL"],
                rows: [
                    ["COMPROMISO DEL PROFESIONAL INDEPENDIENTE CON LA ATENCION  SEGURA DEL PACIENTE", '    ' + promedio.toFixed(2)],
                    ["CONOCIMIENTOS BÁSICOS DE LA SEGURIDAD DEL PACIENTE", '    ' + promedio2.toFixed(2)],
                    ["REGISTRO DE FALLAS EN LA ATENCIÓN EN SALUD y PLAN DE MEJORAMIENTO", '    ' + promedio3.toFixed(2)],
                    ["DETECCIÓN, PREVENCIÓN Y CONTROL DE INFECCIONES ASOCIADAS AL CUIDADO", '    ' + promedio4.toFixed(2)],
                    ["RESULTADOS", '    ' + promedio_total.toFixed(2)]
                ]
            };

            // Dividir la tabla en secciones (por ejemplo, en grupos de 10 filas)
            const chunkSize = 10;
            const chunksTableCount = [];
            for (let i = 0; i < tablecount.rows.length; i += chunkSize) {
                chunksTableCount.push(tablecount.rows.slice(i, i + chunkSize));
            }

            // Iterar a través de las secciones y agregarlas al documento
            chunksTableCount.forEach((section, index) => {
                // Calcular el espacio requerido para la sección
                const sectionHeight = section.length * tableOptions.rowHeight;

                // Verificar si hay espacio suficiente en la página actual
                if (hayEspacioSuficiente(sectionHeight)) {
                    // Agregar la sección a la página actual
                    doc.table({
                        title: tablecount.title,
                        headers: tablecount.headers,
                        rows: section
                    }, tableOptions);
                } else {
                    // Agregar una nueva página antes de la sección
                    doc.addPage();
                    // Asegurarte de ajustar los encabezados o títulos según sea necesario
                    doc.font('Helvetica-Bold').fontSize(14).text(tablecount.title);
                    doc.moveDown();
                    // Agregar la sección a la nueva página
                    doc.table({
                        title: tablecount.title,
                        headers: tablecount.headers,
                        rows: section
                    }, tableOptions);
                }
            });

            doc.moveDown()

            // Tabla "DIAGNÓSTICO"
            const tableOptions3 = {
                columnsSize: [115, 110, 225],
                headerAlign: 'center',
                align: 'center',
                rowHeight: 15,
            };

            const tablerango = {
                headers: ["", "DIAGNÓSTICO", ""],
                rows: [[`Rango 1.0 – 4.0`, `INSUFICIENTE `, `El resultado fue:  `],
                [`Rango 4.1 – 5.0`, `SATISFACTORIO `, `Se debe enviar el plan de mejoramiento con plazo de  un (1) mes, al siguiente correo electrónico: verificacionssdptyo@hotmail.com`]]
            };

            const chunkSize2 = 10;
            const chunksTableRango = [];
            for (let i = 0; i < tablerango.rows.length; i += chunkSize2) {
                chunksTableRango.push(tablerango.rows.slice(i, i + chunkSize2));
            }

            // Iterar a través de las secciones y agregarlas al documento
            chunksTableRango.forEach((section, index) => {
                // Calcular el espacio requerido para la sección
                const sectionHeight = section.length * tableOptions3.rowHeight;

                // Verificar si hay espacio suficiente en la página actual
                if (hayEspacioSuficiente(sectionHeight)) {
                    // Agregar la sección a la página actual
                    doc.table({

                        headers: tablerango.headers,
                        rows: section
                    }, tableOptions3);
                } else {
                    // Agregar una nueva página antes de la sección
                    doc.addPage();
                    // Asegurarte de ajustar los encabezados o títulos según sea necesario

                    doc.moveDown();
                    // Agregar la sección a la nueva página
                    doc.table({
                        headers: tablerango.headers,
                        rows: section
                    }, tableOptions3);
                }
            });

            doc.moveDown()
            doc.moveDown();

            // Tabla "FIRMAS FUNCIONARIO Y PRESTADOR"
            const tableOptions2 = {
                columnsSize: [225, 225],
                headerAlign: 'center',
                align: 'center',
                rowHeight: 15,
            };

            const tablefirmas = {
                headers: ["PROFESIONAL INDEPENDIENTE", "POR SECRETARIA DE SALUD DEPARTAMENTAL"],
                rows: [[`NOMBRE: ${nombreprestador}`, `NOMBRE: ${nombrefuncionario}`],
                [`CARGO: ${cargoprestador}`, `CARGO: ${cargofuncionario}`],
                ]
            };

            // Dividir la tabla de firmas en secciones (por ejemplo, en grupos de 10 filas)
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
