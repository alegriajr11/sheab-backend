import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditoriaRegistroEntity } from '../auditoria_registro.entity';
import { AuditoriaRegistroRepository } from '../auditoria_registro.repository';

@Injectable()
export class AuditoriaEliminacionService {
    constructor(
        @InjectRepository(AuditoriaRegistroEntity)
        private readonly auditoria_registroRepository: AuditoriaRegistroRepository,
    ) { }

    /*USUARIOS*/
    //CONTROLAR LA ELIMINACIÓN DE USUARIO - ADMIN
    async logDeleteUserAdmin(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un usuario ADMIN: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación Usuario ADMIN',
            details,
            direccionIp,
        );
    }

    /** USUARIOS - ROL SIC */
    //logDeleteUserSic
    async logDeleteUserSic(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un usuario SIC: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación Usuario Sic',
            details,
            direccionIp,
        );
    }

    /** USUARIOS - ROL PAMEC */
    //logDeleteUserPamec
    async logDeleteUserPamec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un usuario PAMEC: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación Usuario PAMEC',
            details,
            direccionIp,
        );
    }

    /** USUARIOS - ROL SP */
    //logDeleteUserSP
    async logDeleteUserSp(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un usuario SP: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación Usuario SP',
            details,
            direccionIp,
        );
    }

    /** USUARIOS - ROL RES */
    //logDeleteUserRES
    async logDeleteUserRes(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        usu_nombre2: string,
        usu_nombreUsuario: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un usuario RES: ${usu_nombre2} con nombre de usuario ${usu_nombreUsuario}`;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación Usuario RES',
            details,
            direccionIp,
        );
    }

    //*EVALUACION CRITERIOS - APOYO DIAGNOSTICO*/
    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO DIAGNOSTICO VASCULAR
    async logDeleteDiagnostico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio diagnostico vascular con fecha ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación Criterio Diagnostico Vascular',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO DIALISIS
    async logDeleteDialisis(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio dialisis con fecha ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación Criterio dialisis',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO GESTION PRETRANSFUSIONAL
    async logDeletePretransfusional(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio gestion pretransfusional ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio gestion pretransfusional',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO HEMODINAMIA INTERVENCIONISMO
    async logDeleteHemodinamia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio hemodinamia intervencionismo ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio hemodinamia intervencionismo',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO IMAGENES DIAGNOSTIVAS RAD IONIZANTES
    async logDeleteImaDiagRadIoni(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio imagenes diagnosticas rad ionizantes ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio  imagenes diagnosticas rad ionizantes',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO IMAGENES DIAGNOSTIVAS RAD NO IONIZANTES
    async logDeleteImaDiagRadNoIoni(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio imagenes diagnosticas rad no ionizantes ${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio  imagenes diagnosticas rad no ionizantes',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO LABORATORIO CITOLOGIAS UTERINAS
    async logDeleteLabCitoUterinas(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio laboratiorio citologias uterinas${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio laboratiorio citologias uterinas',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO LABORATORIO CLINICO
    async logDeleteLabClinico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio laboratiorio clinico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio laboratiorio clinico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO LABORATORIO HISTOTECNOLOGIA
    async logDeleteLabHistotec(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio laboratiorio histotecnologia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio laboratiorio histotecnologia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO MEDICINA NUCLEAR
    async logDeleteMedNuclear(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio medicina nuclear${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio medicina nuclear',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO PATOLOGIA
    async logDeletePatologia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio patologia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio patologia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO QUIMIOTERAPIA
    async logDeleteQuimioterapia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio quimioterapia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio quimioterapia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO RADIOLOGIA ODONTOLOGICA
    async logDeleteRadioOdondologica(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio radiologia odontologica${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio radiologia odontologica',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO RADIOTERAPIA
    async logDeleteRadioterapia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio radioterapia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio radioterapia',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO SERVICIO FARMACEUTICO
    async logDeleteServFarmaceutico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio servicio farmaceutico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio servicio farmaceutico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO TERAPIAS
    async logDeleteTerapias(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio terapias${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio terapias',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO TOMA MUESTRAS CUELLO UTERINO
    async logDeleteTomMuestrasUterinas(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio toma muestras cuello uterino${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio toma muestras cuello uterino',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO TOMA MUESTRAS LABORATORIO CLINICO
    async logDeleteTomMuestrasLabClinico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio toma muestras laboratorio clinico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio toma muestras laboratorio clinico',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - ATENCION INMEDIATA*/
    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO PARTO
    async logDeleteParto(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio parto${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio parto',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO PREHOSPITALARIA
    async logDeletePrehospitalaria(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio prehospitalaria${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio prehospitalaria',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO TRANSPORTE ASISTENCIAL
    async logDeleteTransAsistencial(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio trasnporte asistencial${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio trasnporte asistencial',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO URGENCIAS
    async logDeleteUrgencias(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio urgencias${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio urgencias',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - CONSULTA EXTERNA*/
    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO EXTERNA ESPECIALIZADA
    async logDeleteExterEspecializada(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio externa especializada${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio externa especializada',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO EXTERNA GENERAL
    async logDeleteExterGeneral(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio externa general${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio externa general',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO SEGURIDAD SALUD EN EL TRABAJO
    async logDeleteSeguSalud(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio seguridad y salud en el trabajo${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio seguridad y salud en el trabajo',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO VACUNACION
    async logDeleteVacunacion(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio vacunacion${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio vacunacion',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - INTERNACION*/
    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO CUIDADO BASICO CONSUMO PSICOACTIVAS
    async logDeleteConsumoPsicoactivas(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio cuidado basico consumo psicoactivas${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio cuidado basico consumo psicoactivas',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO CUIDADO BASICO NEONATAL
    async logDeleteBasNeonatal(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio cuidado basico neonatal${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio cuidado basico neonatal',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO INTENSIVO ADULTO
    async logDeleteIntenAdulto(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio cuidado intensivo adulto${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio cuidado intensivo adulto',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO INTENSIVO NEONATAL
    async logDeleteIntenNeonatal(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio cuidado intensivo neonatal${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio cuidado intensivo neonatal',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO INTENSIVO PEDIATRICO
    async logDeleteIntenPediatrico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio cuidado intensivo pediatrico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio cuidado intensivo pediatrico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO INTERMEDIO ADULTO
    async logDeleteInterAdulto(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio cuidado intermedio adulto${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio cuidado intermedio adulto',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO INTERMEDIO NEONATAL
    async logDeleteInterNeonatal(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio cuidado intermedio neonatal${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio cuidado intermedio neonatal',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO INTERMEDIO PEDIATRICO
    async logDeleteInterPediatrico(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio cuidado intermedio pediatrico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio cuidado intermedio pediatrico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO HOSPITALIZACION
    async logDeleteHospitalizacion(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio hospitalizacion${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio hospitalizacion',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO HOSPITALIZACION PACIENTE CRONICO
    async logDeleteHospiPacienteCro(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio hospitalizacion paciente cronico${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio hospitalizacion paciente cronico',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO HOSPITALIZACION PARCIAL
    async logDeleteHospiParcial(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio hospitalizacion parcial${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio hospitalizacion parcial',
            details,
            direccionIp,
        );
    }

    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO HOSPITALIZACION SALUD MENTAL
    async logDeleteHospiMental(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio hospitalizacion salud mental${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio hospitalizacion salud mental',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - QUIRURGICO*/
    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO CIRUGIA
    async logDeleteCirugia(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio cirugia${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio cirugia',
            details,
            direccionIp,
        );
    }

    /*EVALUACION CRITERIOS - TODOS LOS SERVICIOS*/
    //CONTROLAR LA ELIMINACIÓN DEL CRITERIO TODOS LOS SERVICIOS
    async logDeleteTodosServicios(
        usu_nombre: string,
        usu_apellido: string,
        direccionIp: string,
        anio: string,
    ): Promise<void> {
        const details = `El usuario ${usu_nombre} ${usu_apellido} ha eliminado un criterio todos los servicios${anio} `;
        await this.logActivity(
            usu_nombre,
            usu_apellido,
            'Eliminación criterio todos los servicios',
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
        const auditoriaEliminacion = new AuditoriaRegistroEntity();

        auditoriaEliminacion.usu_nombre = usu_nombre;
        auditoriaEliminacion.usu_apellido = usu_apellido;
        auditoriaEliminacion.accion = accion;
        auditoriaEliminacion.detalles = detalles;
        auditoriaEliminacion.direccionIp = direccionIp;

        await this.auditoria_registroRepository.save(auditoriaEliminacion);
    }
}
