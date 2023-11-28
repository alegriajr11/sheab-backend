import { ActaVerificacionEntity } from "src/generarpdf/resolucion/verificacion/acta-verificacion.entity";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CumplimientoDiagnosticoVascularEntity } from "../grupo_apoyo_diagnostico/diagnostico_vascular/cumplimiento_diagnost_vascular.entity";
import { CumplimientoDialisisEntity } from "../grupo_apoyo_diagnostico/dialisis/cumplimiento_dialisis.entity";
import { CumplimientoGestionPretransfusionalEntity } from "../grupo_apoyo_diagnostico/gestion_pretransfusional/cumplimiento_gestion_pretrans.entity";
import { CumplimientoHermoIntervenEntity } from "../grupo_apoyo_diagnostico/hemodinamia_intervencionismo/cumplimiento_hemo_inter.entity";
import { CumplimientoImgRadIonizanteEntity } from "../grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_ionizantes/cumplimiento_img_rad_ionizantes.entity";
import { CumplimientoImgRadNoIonizanteEntity } from "../grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_noionizantes/cumplimiento_img_rad_noionizantes.entity";
import { CumplimientoLabUterinaEntity } from "../grupo_apoyo_diagnostico/laboratorio_citologias_uterinas/cumplimiento_lab_citologia_uterina.entity";
import { CumplimientoLabClinicoEntity } from "../grupo_apoyo_diagnostico/laboratorio_clinico/cumplimiento_lab_clinico.entity";
import { CumplimientoLabHistotecnEntity } from "../grupo_apoyo_diagnostico/laboratorio_histotecnologia/cumplimiento_lab_histotec.entity";
import { CumplimientoMedNuclearEntity } from "../grupo_apoyo_diagnostico/medicina_nuclear/cumplimineto_medicina_nuclear.entity";
import { CumplimientoPatologiaEntity } from "../grupo_apoyo_diagnostico/patologia/cumplimiento_patologia.entity";
import { CumplimientoQuimioterapiaEntity } from "../grupo_apoyo_diagnostico/quimioterapia/cumplimiento_quimioterapia.entity";
import { CumplimientoRadOdontologicaEntity } from "../grupo_apoyo_diagnostico/radiologia_odont/cumplimiento_radio_odont.entity";
import { CumplimientoRadioterapiaEntity } from "../grupo_apoyo_diagnostico/radioterapia/cumplimiento_radioterapia.entity";
import { CumplimientoSerFarmaceuticoEntity } from "../grupo_apoyo_diagnostico/servicio_farmaceutico/cumplimiento_s_farmaceutico.entity";
import { CumplimientoTerapiaEntity } from "../grupo_apoyo_diagnostico/terapias/cumplimiento_terapias.entity";
import { CumplimientoCuelloUterinoEntity } from "../grupo_apoyo_diagnostico/toma_muestras_cuello_uterino/cumplimiento_tom_muest_cuello.entity";
import { CumplimientoMuestLabClinicoEntity } from "../grupo_apoyo_diagnostico/toma_muestras_laboratorio_clinico/cumplimiento_tom_muestras.entity";
import { CumplimientoPartoEntity } from "../grupo_atencion_inmediata/parto/cumplimiento_parto.entity";
import { CumplimientoPrehospitalariaEntity } from "../grupo_atencion_inmediata/prehospitalaria/cumplimiento_prehospitalaria.entity";
import { CumplimientoTranspAsistencialEntity } from "../grupo_atencion_inmediata/transporte_asistencial/cumplimiento_trans_asistencial.entity";
import { CumplimientoUrgenciasEntity } from "../grupo_atencion_inmediata/urgencias/cumplimiento_urgencias.entity";
import { CumplimientoExternaGeneralEntity } from "../grupo_consulta_externa/externa_general/cumplimiento_ext_general.entity";
import { CumplimientoSaludTrabajoEntity } from "../grupo_consulta_externa/seguridad_salud_trabajo/cumplimiento_salud_trabajo.entity";
import { CumplimientoVacunacionEntity } from "../grupo_consulta_externa/vacunacion/cumplimiento_vacunacion.entity";
import { CumplimientoConsPsicoactivasEntity } from "../grupo_internacion/cuidado_basico_consumo_psicoactivas/cumplimiento_cuid_cons_psicoact.entity";
import { CumplimientoCuidBasNeonatalEntity } from "../grupo_internacion/cuidado_basico_neonatal/cumplimiento_cuid_basic_neonatal.entity";
import { CumplimientoIntAdultoEntity } from "../grupo_internacion/cuidado_intensivo_adulto/cumplimiento_cuid_intens_adulto.entity";
import { CumplimientoCuidIntNeonatalEntity } from "../grupo_internacion/cuidado_intensivo_neonatal/cumplimiento_cuid_intens_neonatal.entity";
import { CumplimientoCuidIntPediatricoEntity } from "../grupo_internacion/cuidado_intensivo_pediatrico/cumplimiento_cuid_intens_pediatrico.entity";
import { CumplimientoCuidInterAdultoEntity } from "../grupo_internacion/cuidado_intermedio_adulto/cumplimiento_cuid_inter_adulto.entity";
import { CumplimientoCuidInterNeonatalEntity } from "../grupo_internacion/cuidado_intermedio_neonatal/cumplimiento_cuid_inter_neonatal.entity";
import { CumplimientoCuidInterPediatricoEntity } from "../grupo_internacion/cuidado_intermedio_pediatrico/cumplimiento_cuid_inter_pediatrico.entity";
import { CumplimientoHospitalizacionEntity } from "../grupo_internacion/hospitalizacion/cumplimiento_hospitalizacion.entity";
import { CumplimientoHospitCronicoEntity } from "../grupo_internacion/hospitalizacion_paciente_cronico/cumplimiento_hosp_paciente_cron.entity";
import { CumplimientoHospitalizacionParcialEntity } from "../grupo_internacion/hospitalizacion_parcial/cumplimiento_hosp_parcial.entity";
import { CumplimientoHospitalizacionMentalEntity } from "../grupo_internacion/hospitalizacion_salud_mental/cumplimiento_hosp_salud_mental.entity";
import { CumplimientoCirugiaEntity } from "../grupo_quirurgico/cirugia/cumplimiento_cirugia.entity";
import { CumplimientoServiciosEntity } from "../todos_servicios/servicios/cumplimiento_servicios.entity";
import { CumplimientoEspecializadaEntity } from "../grupo_consulta_externa/externa_especializada/cumplimiento_especializada.entity";



@Entity({ name: 'evaluacion-resolucion-verificacion' })
export class EvaluacionResVerificacionEntity {
    @PrimaryGeneratedColumn('increment')
    eva_id: number;

    @Column({ type: 'date', nullable: false })
    eva_creado: Date;


    //RELACION ONE TO ONE EVALUACION CON ACTA VERIFICACION
    @OneToOne(() => ActaVerificacionEntity, actaVerificacion => actaVerificacion.act_eval_veri)
    @JoinColumn()
    eval_acta_veri: ActaVerificacionEntity;

    //Relacion Muchos a Uno EVALUACION-RESOLUCION-VERIFICACION - PRESTADOR
    @ManyToOne(type => PrestadorEntity, prestadorVerificacion => prestadorVerificacion.eval_prestador_verificacion)
    eval_verificacion_prestador: PrestadorEntity;

    //GRUPO APOYO DIAGNOSTICO//
    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_DIAGNOSTICO VASCULAR
    @OneToMany(type => CumplimientoDiagnosticoVascularEntity, cumplimineto_diag_vas => cumplimineto_diag_vas.criterio_diag_vascular)
    eva_cumplimiento_diag_vas: CumplimientoDiagnosticoVascularEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO DIALISIS
    @OneToMany(type => CumplimientoDialisisEntity, cumplimineto_dial => cumplimineto_dial.cump_eva_dial)
    eva_cumplimiento_dial: CumplimientoDialisisEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO GESTION PRETRANS
    @OneToMany(type => CumplimientoGestionPretransfusionalEntity, cumplimineto_pretrans => cumplimineto_pretrans.cump_eva_pretrans)
    eva_cumplimiento_pretrans: CumplimientoGestionPretransfusionalEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO HEMODINAMINA INTER
    @OneToMany(type => CumplimientoHermoIntervenEntity, cumplimineto_hemo => cumplimineto_hemo.cump_eva_hemo_inter)
    eva_cumplimiento_hemo_inter: CumplimientoHermoIntervenEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO IMAGE RADIO IONIZANTES
    @OneToMany(type => CumplimientoImgRadIonizanteEntity, cumplimineto_rad_ioni => cumplimineto_rad_ioni.cump_eva_ima_ioniza)
    eva_cumplimiento_ima_ioniza: CumplimientoImgRadIonizanteEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO IMAGE RADIO NO IONIZANTES
    @OneToMany(type => CumplimientoImgRadNoIonizanteEntity, cumplimineto_rad_ioni => cumplimineto_rad_ioni.cump_eva_ima_noioniza)
    eva_cumplimiento_ima_noioniza: CumplimientoImgRadNoIonizanteEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO LAB CUELLO UTERINOS
    @OneToMany(type => CumplimientoLabUterinaEntity, cumplimineto_cue_uter => cumplimineto_cue_uter.cump_eva_cito_uter)
    eva_cumplimiento_cito_uter: CumplimientoLabUterinaEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO LAB CLINICO
    @OneToMany(type => CumplimientoLabClinicoEntity, cumplimineto_lab_clinico => cumplimineto_lab_clinico.cump_eva_lab_clinico)
    eva_cumplimiento_lab_clinico: CumplimientoLabClinicoEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO LAB HISTOTECNOLOGICO
    @OneToMany(type => CumplimientoLabHistotecnEntity, cumplimineto_lab_histotec => cumplimineto_lab_histotec.cump_eva_lab_histotec)
    eva_cumplimiento_lab_histotec: CumplimientoLabHistotecnEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO MEDICINA NUCLEAR
    @OneToMany(type => CumplimientoMedNuclearEntity, cumplimineto_med_nuclear => cumplimineto_med_nuclear.cump_eva_med_nuclear)
    eva_cumplimiento_med_nuclear: CumplimientoMedNuclearEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO PATOLOGIA
    @OneToMany(type => CumplimientoPatologiaEntity, cumplimineto_patologia => cumplimineto_patologia.cump_eva_patologia)
    eva_cumplimiento_patologia: CumplimientoPatologiaEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO QUIMIOTERAPIA
    @OneToMany(type => CumplimientoQuimioterapiaEntity, cumplimineto_quimio => cumplimineto_quimio.cump_eva_quimio)
    eva_cumplimiento_quimio: CumplimientoQuimioterapiaEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO RADIOLOGIA ODONTOLOGICA
    @OneToMany(type => CumplimientoRadOdontologicaEntity, cumplimineto_radio_odont => cumplimineto_radio_odont.cump_eva_radio_odont)
    eva_cumplimiento_radio_odont: CumplimientoRadOdontologicaEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO RADIOLOGIA
    @OneToMany(type => CumplimientoRadioterapiaEntity, cumplimineto_radio => cumplimineto_radio.cump_eva_radio)
    eva_cumplimiento_radio: CumplimientoRadioterapiaEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO SERVICIO FARMACEUTICO
    @OneToMany(type => CumplimientoSerFarmaceuticoEntity, cumplimineto_serv_farma => cumplimineto_serv_farma.cump_eva_serv_farma)
    eva_cumplimiento_serv_farma: CumplimientoSerFarmaceuticoEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO TERAPIA
    @OneToMany(type => CumplimientoTerapiaEntity, cumplimineto_terapia => cumplimineto_terapia.cump_eva_terapia)
    eva_cumplimiento_terapia: CumplimientoTerapiaEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO TOMA MUESTRAS CUELLO UTERINO
    @OneToMany(type => CumplimientoCuelloUterinoEntity, cumplimineto_cuello_uterino => cumplimineto_cuello_uterino.cump_eva_cuello_uterino)
    eva_cumplimiento_cuello_uterino: CumplimientoCuelloUterinoEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO TOMA MUESTRAS LAB CLINICO
    @OneToMany(type => CumplimientoMuestLabClinicoEntity, cumplimineto_lab_cli => cumplimineto_lab_cli.cump_eva_toma_muestras_lab_cli)
    eva_cumplimiento_toma_muestras_lab_cli: CumplimientoMuestLabClinicoEntity[];


    //GRUPO ATENCION INMEDIATA//
    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO PARTO
    @OneToMany(type => CumplimientoPartoEntity, cumplimineto_lab_cli => cumplimineto_lab_cli.cump_eva_parto)
    eva_cumplimiento_parto: CumplimientoPartoEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO PREHOSPITALARIA
    @OneToMany(type => CumplimientoPrehospitalariaEntity, cumplimineto_lab_cli => cumplimineto_lab_cli.cump_eva_prehospi)
    eva_cumplimiento_prehospi: CumplimientoPrehospitalariaEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO TRANS ASISTENCIAL
    @OneToMany(type => CumplimientoTranspAsistencialEntity, cumplimineto_lab_cli => cumplimineto_lab_cli.cump_eva_trans_asist)
    eva_cumplimiento_trans_asist: CumplimientoTranspAsistencialEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO URGENCIAS
    @OneToMany(type => CumplimientoUrgenciasEntity, cumplimineto_lab_cli => cumplimineto_lab_cli.cump_eva_urgencias)
    eva_cumplimiento_urgencias: CumplimientoUrgenciasEntity[];


    //GRUPO CONSULTA EXTERNA//
    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_ESPECIALIZADA 
    @OneToMany(type => CumplimientoEspecializadaEntity, cumplimineto_espec => cumplimineto_espec.cump_eva_espe)
    eva_espec_cumplimiento: CumplimientoEspecializadaEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_GENERAL
    @OneToMany(type => CumplimientoExternaGeneralEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_general)
    eva_gene_cumplimiento: CumplimientoExternaGeneralEntity[];


    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_SALUD EN EL TRABAJO
    @OneToMany(type => CumplimientoSaludTrabajoEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_salud)
    eva_salud_cumplimiento: CumplimientoSaludTrabajoEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_VACUNACION
    @OneToMany(type => CumplimientoVacunacionEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_vacu)
    eva_vacu_cumplimiento: CumplimientoVacunacionEntity[];


    //GRUPO CONSULTA INTERNACION//
    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_CONSUMO_PSICOACTIVAS
    @OneToMany(type => CumplimientoConsPsicoactivasEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_cons_psico)
    eva_cons_psico_cumplimiento: CumplimientoConsPsicoactivasEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_CUIDADO_BASICO NEONATAL
    @OneToMany(type => CumplimientoCuidBasNeonatalEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_bas_neo)
    eva_bas_neo_cumplimiento: CumplimientoCuidBasNeonatalEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CumplimientoIntAdultoEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_intens_adul)
    eva_intens_adul_cumplimiento: CumplimientoIntAdultoEntity[];


    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_CUIDADO_INTENSIVO_NEONATAL
    @OneToMany(type => CumplimientoCuidIntNeonatalEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_intens_neo)
    eva_intens_neo_cumplimiento: CumplimientoCuidIntNeonatalEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_CUIDADO_INTENSIVO_PEDIATRICO
    @OneToMany(type => CumplimientoCuidIntPediatricoEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_intens_pedia)
    eva_intens_pedia_cumplimiento: CumplimientoCuidIntPediatricoEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_CUIDADO_INTERMEDIO_ADULTO
    @OneToMany(type => CumplimientoCuidInterAdultoEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_inter_adul)
    eva_inter_adul_cumplimiento: CumplimientoCuidInterAdultoEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_CUIDADO_INTERMEDIO_NEONATAL
    @OneToMany(type => CumplimientoCuidInterNeonatalEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_inter_neo)
    eva_inter_neo_cumplimiento: CumplimientoCuidInterNeonatalEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_CUIDADO_INTERMEDIO_PEDIATRICO
    @OneToMany(type => CumplimientoCuidInterPediatricoEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_inter_pedi)
    eva_inter_pedi_cumplimiento: CumplimientoCuidInterPediatricoEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_HOSPITALIZACION
    @OneToMany(type => CumplimientoHospitalizacionEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_hospi)
    eva_hospi_cumplimiento: CumplimientoHospitalizacionEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_HOSPITALIZACION PACIENTE CRONICO
    @OneToMany(type => CumplimientoHospitCronicoEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_hospi_cronico)
    eva_hospi_cronico_cumplimiento: CumplimientoHospitCronicoEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_HOSPITALIZACION PARCIAL
    @OneToMany(type => CumplimientoHospitalizacionParcialEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_hospi_parcial)
    eva_hospi_parcial_cumplimiento: CumplimientoHospitalizacionParcialEntity[];

    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_HOSPITALIZACION MENTAL
    @OneToMany(type => CumplimientoHospitalizacionMentalEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_hospi_mental)
    eva_hospi_mental_cumplimiento: CumplimientoHospitalizacionMentalEntity[];

     //GRUPO  QUIRURGICO//
    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_CIRUGIA
    @OneToMany(type => CumplimientoCirugiaEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_cirugia)
    eva_cirugia_cumplimiento: CumplimientoCirugiaEntity[];

     //GRUPO TODOS LOS SERVICIOS//
    //Relacion Uno a Muchos EVALUACION RES - CUMPLIMIENTO_TODOS LOS SERVICIOS
    @OneToMany(type => CumplimientoServiciosEntity, cumplimineto_gene => cumplimineto_gene.cump_eva_todos_servi)
    eva_todos_servi_cumplimiento: CumplimientoServiciosEntity[];
}