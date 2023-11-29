import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditoriaRegistroEntity } from '../auditoria_registro.entity';
import { AuditoriaRegistroRepository } from '../auditoria_registro.repository';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class AuditoriaRegistroService {
    constructor(
        @InjectRepository(AuditoriaRegistroEntity)
        private readonly auditoria_registroRepository: AuditoriaRegistroRepository,
    ) { }

    /*USUARIOS*/
    //CONTROLAR EL REGISTRO DE EN QUE MOMENTO EL USUARIO INCIA SESIÓN
    async logLogin(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha iniciado sesión `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Inicio de Sesión',
            details,
            direccionIp,
        );
    }

    /** USUARIOS - ROL ADMIN */
    //CONTROLAR LA CREACIÓN DE USUARO - ADMIN
    async logCreateUserAdmin(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Usuario ADMIN: ${usu_nombre2}  con nombre de usuario: ${usu_nombreUsuario}  `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Usuario ADMIN',
            details,
            direccionIp,
        );
    }

    /** USUARIOS - ROL SIC */
    //CONTROLAR LA CREACIÓN DE UN USUARIO DE ROL SIC
    async logCreateUserSic(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Usuario SIC: ${usu_nombre2}  con nombre de usuario: ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Usuario Sic',
            details,
            direccionIp,
        );
    }

    /** USUARIOS - ROL PAMEC */
    //logCreateUserPamec
    async logCreateUserPamec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Usuario PAMEC: ${usu_nombre2}  con nombre de usuario: ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Usuario PAMEC',
            details,
            direccionIp,
        );
    }

    //logCreateUserSP
    async logCreateUserSp(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Usuario SP: ${usu_nombre2}  con nombre de usuario: ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Usuario SP',
            details,
            direccionIp,
        );
    }

    /** USUARIOS - ROL RES */
    //logCreateUserRES
    async logCreateUserRes(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Usuario RES: ${usu_nombre2}  con nombre de usuario: ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Usuario RES',
            details,
            direccionIp,
        );
    }

    /*ACTAS - SIC*/
    //CONTROLAR LA CREACIÓN DE  SIC ACTA
    async logCreateActaSic(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Acta Sic con No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Acta Sic',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LOG CIERRE DE ACTA SIC
    async logCierreActaSic(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Cerrado el Acta No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Cierre Acta SIC',
            details,
            direccionIp,
        );
    }
    //CONTROLAR LOG CIERRE DE ACTA SP -IPS
    async logCierreActaSpIps(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Cerrado el Acta No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Cierre Acta SP IPS',
            details,
            direccionIp,
        );
    }
    //CONTROLAR LOG CIERRE DE ACTA SP-IND
    async logCierreActaSpInd(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Cerrado el Acta No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Cierre Acta SP Independientes',
            details,
            direccionIp,
        );
    }

    /*ACTAS - PAMEC*/
    //CONTROLAR LA CREACIÓN DE  PAMEC ACTA
    async logCreateActaPamec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Acta Pamec con No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Acta Pamec',
            details,
            direccionIp,
        );
    }

    /*ACTAS - RESOLUCIÓN VERIFICACION*/
    //CONTROLAR LA CREACIÓN DE ACTA-VERIFICACION
    async logCreateActaVerificacion(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Acta de Verificacion con No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Acta Verificacion',
            details,
            direccionIp,
        );
    }

    /*ACTAS - SP*/
    //CONTROLAR LA CREACIÓN DE  SP INDEPENDIENTE ACTA
    async logCreateActaSpIndep(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Acta SP Independiente  con No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Acta SP Independiente',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DE  SP IPS ACTA
    async logCreateActaSpIps(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un Acta IPS  con No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Acta IPS',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - APOYO DIAGNOSTICO*/
    //CONTROLAR LA CREACIÓN DEL CRITERIO DIAGNOSTICO VASCULAR
    async logCreateDiagnostico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio diagnostico vascular con fecha ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Criterio Diagnostico Vascular',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO DIALISIS
    async logCreateDialisis(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio dialisis con fecha ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Criterio dialisis',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO GESTION PRETRANSFUSIONAL
    async logCreatePretransfusional(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio gestion pretransfusional ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio gestion pretransfusional',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO HEMODINAMIA INTERVENCIONISMO
    async logCreateHemodinamia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio hemodinamia intervencionismo ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio hemodinamia intervencionismo',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO IMAGENES DIAGNOSTIVAS RAD IONIZANTES
    async logCreateImaDiagRadIoni(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio imagenes diagnosticas rad ionizantes ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio  imagenes diagnosticas rad ionizantes',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO IMAGENES DIAGNOSTIVAS RAD NO IONIZANTES
    async logCreateImaDiagRadNoIoni(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio imagenes diagnosticas rad no ionizantes ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio  imagenes diagnosticas rad no ionizantes',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO LABORATORIO CITOLOGIAS UTERINAS
    async logCreateLabCitoUterinas(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio laboratiorio citologias uterinas${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio laboratiorio citologias uterinas',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO LABORATORIO CLINICO
    async logCreateLabClinico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio laboratiorio clinico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio laboratiorio clinico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO LABORATORIO HISTOTECNOLOGIA
    async logCreateLabHistotec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio laboratiorio histotecnologia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio laboratiorio histotecnologia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO MEDICINA NUCLEAR
    async logCreateMedNuclear(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio medicina nuclear${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio medicina nuclear',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO PATOLOGIA
    async logCreatePatologia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio patologia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio patologia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO QUIMIOTERAPIA
    async logCreateQuimioterapia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio quimioterapia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio quimioterapia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO RADIOLOGIA ODONTOLOGICA
    async logCreateRadioOdondologica(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio radiologia odontologica${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio radiologia odontologica',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO RADIOTERAPIA
    async logCreateRadioterapia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio radioterapia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio radioterapia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO SERVICIO FARMACEUTICO
    async logCreateServFarmaceutico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio servicio farmaceutico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio servicio farmaceutico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO TERAPIAS
    async logCreateTerapias(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio terapias${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio terapias',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO TOMA MUESTRAS CUELLO UTERINO
    async logCreateTomMuestrasUterinas(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio toma muestras cuello uterino${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio toma muestras cuello uterino',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO TOMA MUESTRAS LABORATORIO CLINICO
    async logCreateTomMuestrasLabClinico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio toma muestras laboratorio clinico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio toma muestras laboratorio clinico',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - ATENCION INMEDIATA*/
    //CONTROLAR LA CREACIÓN DEL CRITERIO PARTO
    async logCreateParto(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio parto${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio parto',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO PREHOSPITALARIA
    async logCreatePrehospitalaria(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio prehospitalaria${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio prehospitalaria',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO TRANSPORTE ASISTENCIAL
    async logCreateTransAsistencial(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio trasnporte asistencial${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio trasnporte asistencial',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO URGENCIAS
    async logCreateUrgencias(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio urgencias${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio urgencias',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - CONSULTA EXTERNA*/
    //CONTROLAR LA CREACIÓN DEL CRITERIO EXTERNA ESPECIALIZADA
    async logCreateExterEspecializada(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio externa especializada${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio externa especializada',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO EXTERNA GENERAL
    async logCreateExterGeneral(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio externa general${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio externa general',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO SEGURIDAD SALUD EN EL TRABAJO
    async logCreateSeguSalud(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio seguridad y salud en el trabajo${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio seguridad y salud en el trabajo',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO VACUNACION
    async logCreateVacunacion(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio vacunacion${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio vacunacion',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - INTERNACION*/
    //CONTROLAR LA CREACIÓN DEL CRITERIO CUIDADO BASICO CONSUMO PSICOACTIVAS
    async logCreateConsumoPsicoactivas(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio cuidado basico consumo psicoactivas${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio cuidado basico consumo psicoactivas',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO CUIDADO BASICO NEONATAL
    async logCreateBasNeonatal(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio cuidado basico neonatal${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio cuidado basico neonatal',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO INTENSIVO ADULTO
    async logCreateIntenAdulto(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio cuidado intensivo adulto${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio cuidado intensivo adulto',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO INTENSIVO NEONATAL
    async logCreateIntenNeonatal(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio cuidado intensivo neonatal${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio cuidado intensivo neonatal',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO INTENSIVO PEDIATRICO
    async logCreateIntenPediatrico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio cuidado intensivo pediatrico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio cuidado intensivo pediatrico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO INTERMEDIO ADULTO
    async logCreateInterAdulto(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio cuidado intermedio adulto${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio cuidado intermedio adulto',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO INTERMEDIO NEONATAL
    async logCreateInterNeonatal(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio cuidado intermedio neonatal${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio cuidado intermedio neonatal',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO INTERMEDIO PEDIATRICO
    async logCreateInterPediatrico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio cuidado intermedio pediatrico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio cuidado intermedio pediatrico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO HOSPITALIZACION
    async logCreateHospitalizacion(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio hospitalizacion${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio hospitalizacion',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO HOSPITALIZACION PACIENTE CRONICO
    async logCreateHospiPacienteCro(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio hospitalizacion paciente cronico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio hospitalizacion paciente cronico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO HOSPITALIZACION PARCIAL
    async logCreateHospiParcial(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio hospitalizacion parcial${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio hospitalizacion parcial',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DEL CRITERIO HOSPITALIZACION SALUD MENTAL
    async logCreateHospiMental(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio hospitalizacion salud mental${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio hospitalizacion salud mental',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - QUIRURGICO*/
    //CONTROLAR LA CREACIÓN DEL CRITERIO CIRUGIA
    async logCreateCirugia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio cirugia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio cirugia',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - TODOS LOS SERVICIOS*/
    //CONTROLAR LA CREACIÓN DEL CRITERIO TODOS LOS SERVICIOS
    async logCreateTodosServicios(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado un criterio todos los servicios${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación criterio todos los servicios',
            details,
            direccionIp,
        );
    }

    //CREACION DE CALIFICACION
    //CONTROLAR LA CREACIÓN DE  SP INDEPENDIENTE ACTA
    async logcreatecalificacion(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cal_nota: number,
        anio: string,
        cal_observaciones: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha creado una calificacion con nota ${cal_nota} del año ${anio} con la observacion: ${cal_observaciones} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Acta Independiente ',
            details,
            direccionIp,
        );
    }

    //CONTROLAR EL CUMPLIMIENTO SIC ASIGNADO POR EL USUARIO
    //CONTROLAR LA CREACIÓN DE CUMPLIMIENTO SIC
    async logCreateCumplimientoSic(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cumpl_cumple: string,
        cri_nombre: string,
        act_id: number,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha asignado un Cumplimiento Sic (${cumpl_cumple}) del criterio "${cri_nombre}" del acta No. ${act_id} del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Cumplimiento Sic',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DE UNA CALIFICACION SP INDEPENDIENTE
    async logCreateCalificacionSpInd(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cal_nota: number,
        cri_nombre: string,
        act_id: number,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha asignado una calificacion Sp Ind de: (${cal_nota}) al criterio "${cri_nombre}" del acta No. ${act_id} del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Calificacion Sp Independientes',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DE UNA CALIFICACION SP IPS
    async logCreateCalificacionSpIps(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cal_nota: number,
        cri_nombre: string,
        nombre_evaluacion: string,
        act_id: number,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha asignado una calificacion Sp Ips con nota: (${cal_nota}) al criterio "${cri_nombre}" de la evaluacion: "${nombre_evaluacion}" del acta No. ${act_id} del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Calificacion Sp Ips',
            details,
            direccionIp,
        );
    }



    //CONTROLAR LA CREACIÓN DE UNA CALIFICACION PAMEC
    async logCreateCalificacionPamec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cal_nota: number,
        cri_nombre: string,
        act_id: number,
        anio: string,
    ): Promise<void> {
        if (!cal_nota) {
            const details = `El usuario ${usu_nombre} ${usu_apellido} ha asignado una calificacion al Pamec de (NO APLICA) al criterio "${cri_nombre}" del acta No. ${act_id} del año ${anio}`;
            await this.logActivity(
                usu_nombre,
                usu_apellido,
                'Creación Calificacion Pamec',
                details,
                direccionIp,
            );
        }
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha asignado una calificacion al Pamec con nota de: (${cal_nota}) al criterio "${cri_nombre}" del acta No. ${act_id} del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Calificacion Pamec',
            details,
            direccionIp,
        );
    }


    //CONTROLAR LA CREACIÓN DE UN CRITERIO PAMEC
    async logCreateCriterioPamec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        crip_nombre: string,
        act_nombre: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Creado un Criterio Pamec  con descripcion "${crip_nombre}" y actividad "${act_nombre}" del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Creación Criterio Pamec',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DE UN CRITERIO SIC
    async logCreateCriterioSic(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cri_nombre: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Creado un Criterio Sic  con descripcion "${cri_nombre}"  del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Criterio Sic',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DE UN CRITERIO SP INDEPENDIENTES
    async logCreateCriterioSpind(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        crip_nombre: string,
        etapa_nombre: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Creado un Criterio Sp Independientes   "${crip_nombre}" con etapa "${etapa_nombre}"  del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Criterio Sp Independientes',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA CREACIÓN DE UN CRITERIO  SP IPS
    async logCreateCriterioSpIps(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        crip_nombre: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Creado un Criterio Sp Ips  con descripcion "${crip_nombre}"  del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Criterio Sic',
            details,
            direccionIp,
        );
    }


    /* CONSULTAS DE AUDITORIA - SERVICIO DE AUDITORIA */
    // LISTA DE AUDITORIAS POR FECHA INICIO Y FECHA FINAL
    //ENCONTRAR ACTAS POR FECHA EXACTA
    async findAllFromDate(
        fechaInicio?: Date,
        fechaFin?: Date,
        accion?: string,
    ): Promise<AuditoriaRegistroEntity[]> {
        let query =
            this.auditoria_registroRepository.createQueryBuilder('auditoria');

        if (accion) {
            query = query.where('auditoria.accion LIKE :accion', {
                accion: `%${accion}%`,
            });
        }

        if (fechaInicio && fechaFin) {
            // Ajustar la fecha de fin para incluir hasta el final del día
            const fechaFinAjustada = new Date(fechaFin);
            fechaFinAjustada.setHours(23, 59, 59, 999);

            query = query
                .andWhere('auditoria.creadoEn >= :fechaInicio', { fechaInicio })
                .andWhere('auditoria.creadoEn <= :fechaFin', {
                    fechaFin: fechaFinAjustada,
                });
        }

        query = query.orderBy('auditoria.id', 'DESC');

        const auditorias = await query.getMany();

        if (auditorias.length === 0) {
            throw new NotFoundException(
                new MessageDto('No hay auditorias con los filtros especificados'),
            );
        }

        return auditorias;
    }

    //LISTAR TODAS LAS AUDITORIAS POR NOMBRE Y APELLIDOS DEL FUNCIONARIO
    async findAllAuditoriaNomApel(
        usu_nombre_apellido: string,
    ): Promise<AuditoriaRegistroEntity[]> {
        const usu_nombres = usu_nombre_apellido.trim();

        const auditoria = await this.auditoria_registroRepository
            .createQueryBuilder('auditoria')
            .where(
                'CONCAT(auditoria.usu_nombre, " ", auditoria.usu_apellido) LIKE :usu_nombres',
                { usu_nombres: `%${usu_nombres}%` },
            )
            .getMany();

        if (!auditoria.length)
            throw new NotFoundException(
                new MessageDto('No hay Auditorias en la lista'),
            );

        return auditoria;
    }

    async getAllAuditorias(): Promise<AuditoriaRegistroEntity[]> {
        const auditoria = await this.auditoria_registroRepository.find({
            order: { id: 'DESC' },
        });
        if (!auditoria.length)
            throw new NotFoundException(
                new MessageDto('No hay Auditorias en la lista'),
            );
        return auditoria;
    }

    //REGISTRO DE AUDITORIA CON SU RESPECTIVA IDENTIFICACION DE QUE USUARIO REALIZÓ ALGUNA SOLICITUD
    private async logActivity(
        usu_nombre: string,
        usu_apellido: string,
        accion: string,
        detalles: string,
        direccionIp: string,
    ): Promise<void> {
        const auditoriaRegistro = new AuditoriaRegistroEntity();

        auditoriaRegistro.usu_nombre = usu_nombre;
        auditoriaRegistro.usu_apellido = usu_apellido;
        auditoriaRegistro.accion = accion;
        auditoriaRegistro.detalles = detalles;
        auditoriaRegistro.direccionIp = direccionIp;

        await this.auditoria_registroRepository.save(auditoriaRegistro);
    }
}
