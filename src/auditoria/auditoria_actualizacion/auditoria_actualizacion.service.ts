import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditoriaRegistroEntity } from '../auditoria_registro.entity';
import { AuditoriaRegistroRepository } from '../auditoria_registro.repository';

@Injectable()
export class AuditoriaActualizacionService {
    constructor(
        @InjectRepository(AuditoriaRegistroEntity)
        private readonly auditoria_registroRepository: AuditoriaRegistroRepository,
    ) { }

    //CONTROLAR LA ACTUALIZACIÓN DE USUARIO - ADMIN
    async logUpdateUserAdmin(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un usuario ADMIN: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Usuario ADMIN',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DE USUARIO - SP
    //logUpdateUserSP
    async logUpdateUserSp(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un usuario SP: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Usuario SP',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DE USUARIO - PAMEC
    //logUpdateUserPamec
    async logUpdateUserPamec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un usuario PAMEC: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Usuario PAMEC',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DE USUARIO - RES
    //logUpdateUserRES
    async logUpdateUserRes(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un usuario RESOLUCIÓN 3100: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Usuario RESOLUCIÓN 3100',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DE USUARIO - SIC
    //logUpdateUserSic
    async logUpdateUserSic(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un usuario SIC: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Usuario Sic',
            details,
            direccionIp,
        );
    }

    /*ACTAS - SIC*/
    //CONTROLAR LA ACTUALIZACIÓN DE  SIC ACTA
    async logUpdateActaSic(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un Acta SIC con No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Acta SIC',
            details,
            direccionIp,
        );
    }

    /*ACTAS - PAMEC*/
    //CONTROLAR LA ACTUALIZACIÓN DE  PAMEC ACTA
    async logUpdateActaPamec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un Pamec Acta  con No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Pamec Acta ',
            details,
            direccionIp,
        );
    }

    /*ACTAS - SP*/
    //CONTROLAR LA ACTUALIZACIÓN DE  SP INDEPENDIENTE ACTA
    async logUpdateActaSpIndep(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un Acta SP Independiente  con No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Acta SP Independiente ',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DE SP IPS ACTA
    async logUpdateActaSpIps(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        act_id: number,
        anio: string,
        pre_nombre: string,
        pre_cod_habilitacion,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un Acta IPS  con No. ${act_id} del año ${anio} perteneciente al prestador: ${pre_nombre} con código de habilitación: ${pre_cod_habilitacion} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Acta IPS ',
            details,
            direccionIp,
        );
    }

    //*CALIFICACIONES Y CUMPLIMIENTOS*//
    //CONTROLAR LA ACTUALIZACIÓN DE UNA CALIFICACION PAMEC
    async logUpdateCalificacionPamec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cal_nota: number,
        cri_nombre: string,
        act_id: number,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado una calificacion Pamec (${cal_nota}) al criterio "${cri_nombre}" del acta No. ${act_id} del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Calificacion Pamec',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DE UNA CALIFICACION PAMEC
    async logUpdateCalificacionSpInd(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cal_nota: number,
        cri_nombre: string,
        act_id: number,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado una calificacion Seguridad del Paciente - Indepenndientes (${cal_nota}) al criterio "${cri_nombre}" del acta No. ${act_id} del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Calificacion SP Independientes',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DE UNA CALIFICACION SP IPS
    async logUpdateCalificacionSpIps(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cal_nota: number,
        cri_nombre: string,
        nombre_evaluacion: string,
        act_id: number,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado una calificacion Sp Ips con nota: (${cal_nota}) al criterio "${cri_nombre}" de la evaluación: "${nombre_evaluacion}" y del acta No. ${act_id} del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Calificacion SP IPS',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DE UNA CALIFICACION PAMEC
    async logUpdateCumplimientoSic(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        cumpl_cumple: String,
        cri_nombre: string,
        act_id: number,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un Cumplimiento Sic (${cumpl_cumple}) al criterio "${cri_nombre}" del acta No. ${act_id} del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Cumplimiento Sic',
            details,
            direccionIp,
        );
    }

    
    //CONTROLAR LA ACTUALIZACION DE UN CRITERIO SP INDEPENDIENTES
    async logUpdateCriterioSpind(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        crip_nombre: string,
        etapa_nombre: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha Actualizado un Criterio Sp Independientes   "${crip_nombre}" con etapa "${etapa_nombre}"  del año ${anio}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Criterio Sp Independientes',
            details,
            direccionIp,
        );
    }


    //*EVALUACION CRITERIOS - APOYO DIAGNOSTICO*/
    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO DIAGNOSTICO VASCULAR
    async logUpdateDiagnostico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio diagnostico vascular con fecha ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Criterio Diagnostico Vascular',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO DIALISIS
    async logUpdateDialisis(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio dialisis con fecha ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización Criterio dialisis',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO GESTION PRETRANSFUSIONAL
    async logUpdatePretransfusional(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio gestion pretransfusional ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio gestion pretransfusional',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO HEMODINAMIA INTERVENCIONISMO
    async logUpdateHemodinamia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio hemodinamia intervencionismo ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio hemodinamia intervencionismo',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO IMAGENES DIAGNOSTIVAS RAD IONIZANTES
    async logUpdateImaDiagRadIoni(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio imagenes diagnosticas rad ionizantes ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio  imagenes diagnosticas rad ionizantes',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO IMAGENES DIAGNOSTIVAS RAD NO IONIZANTES
    async logUpdateImaDiagRadNoIoni(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio imagenes diagnosticas rad no ionizantes ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio  imagenes diagnosticas rad no ionizantes',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO LABORATORIO CITOLOGIAS UTERINAS
    async logUpdateLabCitoUterinas(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio laboratiorio citologias uterinas${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio laboratiorio citologias uterinas',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO LABORATORIO CLINICO
    async logUpdateLabClinico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio laboratiorio clinico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio laboratiorio clinico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO LABORATORIO HISTOTECNOLOGIA
    async logUpdateLabHistotec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio laboratiorio histotecnologia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio laboratiorio histotecnologia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO MEDICINA NUCLEAR
    async logUpdateMedNuclear(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio medicina nuclear${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio medicina nuclear',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO PATOLOGIA
    async logUpdatePatologia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio patologia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio patologia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO QUIMIOTERAPIA
    async logUpdateQuimioterapia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio quimioterapia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio quimioterapia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO RADIOLOGIA ODONTOLOGICA
    async logUpdateRadioOdondologica(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio radiologia odontologica${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio radiologia odontologica',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO RADIOTERAPIA
    async logUpdateRadioterapia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio radioterapia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio radioterapia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO SERVICIO FARMACEUTICO
    async logUpdateServFarmaceutico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio servicio farmaceutico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio servicio farmaceutico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO TERAPIAS
    async logUpdateTerapias(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio terapias${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio terapias',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO TOMA MUESTRAS CUELLO UTERINO
    async logUpdateTomMuestrasUterinas(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio toma muestras cuello uterino${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio toma muestras cuello uterino',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO TOMA MUESTRAS LABORATORIO CLINICO
    async logUpdateTomMuestrasLabClinico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio toma muestras laboratorio clinico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio toma muestras laboratorio clinico',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - ATENCION INMEDIATA*/
    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO PARTO
    async logUpdateParto(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio parto${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio parto',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO PREHOSPITALARIA
    async logUpdatePrehospitalaria(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio prehospitalaria${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio prehospitalaria',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO TRANSPORTE ASISTENCIAL
    async logUpdateTransAsistencial(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio trasnporte asistencial${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio trasnporte asistencial',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO URGENCIAS
    async logUpdateUrgencias(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio urgencias${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio urgencias',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - CONSULTA EXTERNA*/
    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO EXTERNA ESPECIALIZADA
    async logUpdateExterEspecializada(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio externa especializada${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio externa especializada',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO EXTERNA GENERAL
    async logUpdateExterGeneral(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio externa general${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio externa general',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO SEGURIDAD SALUD EN EL TRABAJO
    async logUpdateSeguSalud(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio seguridad y salud en el trabajo${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio seguridad y salud en el trabajo',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO VACUNACION
    async logUpdateVacunacion(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio vacunacion${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio vacunacion',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - INTERNACION*/
    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO CUIDADO BASICO CONSUMO PSICOACTIVAS
    async logUpdateConsumoPsicoactivas(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio cuidado basico consumo psicoactivas${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio cuidado basico consumo psicoactivas',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO CUIDADO BASICO NEONATAL
    async logUpdateBasNeonatal(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio cuidado basico neonatal${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio cuidado basico neonatal',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO INTENSIVO ADULTO
    async logUpdateIntenAdulto(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio cuidado intensivo adulto${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio cuidado intensivo adulto',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO INTENSIVO NEONATAL
    async logUpdateIntenNeonatal(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio cuidado intensivo neonatal${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio cuidado intensivo neonatal',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO INTENSIVO PEDIATRICO
    async logUpdateIntenPediatrico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio cuidado intensivo pediatrico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio cuidado intensivo pediatrico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO INTERMEDIO ADULTO
    async logUpdateInterAdulto(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio cuidado intermedio adulto${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio cuidado intermedio adulto',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO INTERMEDIO NEONATAL
    async logUpdateInterNeonatal(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio cuidado intermedio neonatal${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio cuidado intermedio neonatal',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO INTERMEDIO PEDIATRICO
    async logUpdateInterPediatrico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio cuidado intermedio pediatrico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio cuidado intermedio pediatrico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO HOSPITALIZACION
    async logUpdateHospitalizacion(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio hospitalizacion${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio hospitalizacion',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO HOSPITALIZACION PACIENTE CRONICO
    async logUpdateHospiPacienteCro(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio hospitalizacion paciente cronico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio hospitalizacion paciente cronico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO HOSPITALIZACION PARCIAL
    async logUpdateHospiParcial(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio hospitalizacion parcial${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio hospitalizacion parcial',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO HOSPITALIZACION SALUD MENTAL
    async logUpdateHospiMental(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio hospitalizacion salud mental${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio hospitalizacion salud mental',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - QUIRURGICO*/
    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO CIRUGIA
    async logUpdateCirugia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio cirugia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio cirugia',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - TODOS LOS SERVICIOS*/
    //CONTROLAR LA ACTUALIZACIÓN DEL CRITERIO TODOS LOS SERVICIOS
    async logUpdateTodosServicios(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha actualizado un criterio todos los servicios${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Actualización criterio todos los servicios',
            details,
            direccionIp,
        );
    }

    //REGISTRO DE AUDITORIA CON SU RESPECTIVA IDENTIFICACION DE QUE USUARIO REALIZÓ ALGUNA SOLICITUD
    private async logActivity(
        usu_nombre: string,
        usu_apellido: string,
        accion: string,
        detalles: string,
        direccionIp: string,
    ): Promise<void> {
        const auditoriaActualizacion = new AuditoriaRegistroEntity();

        auditoriaActualizacion.usu_nombre = usu_nombre;
        auditoriaActualizacion.usu_apellido = usu_apellido;
        auditoriaActualizacion.accion = accion;
        auditoriaActualizacion.detalles = detalles;
        auditoriaActualizacion.direccionIp = direccionIp;

        await this.auditoria_registroRepository.save(auditoriaActualizacion);
    }
}
