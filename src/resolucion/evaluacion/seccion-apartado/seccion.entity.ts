import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CriterioDiagnostVascularEntity } from "../grupo_apoyo_diagnostico/diagnostico_vascular/criterio_diagnost_vascular.entity";
import { CriterioSaludTrabajoEntity } from "../grupo_consulta_externa/seguridad_salud_trabajo/criterios_salud_trabajo.entity";
import { CriterioDialisisEntity } from "../grupo_apoyo_diagnostico/dialisis/criterio_dialisis.entity";
import { CriterioGestionPretransfusionalEntity } from "../grupo_apoyo_diagnostico/gestion_pretransfusional/criterio_gestion_pretrans.entity";
import { CriterioHermoIntervenEntity } from "../grupo_apoyo_diagnostico/hemodinamia_intervencionismo/criterio_hemo_inter.entity";
import { CriterioImgRadIonizantesEntity } from "../grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_ionizantes/criterio_img_rad_ionizantes.entity";
import { CriterioImgRadNoIonizantesEntity } from "../grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_noionizantes/criterio_img_rad_noionizantes.entity";
import { CriterioLabUterinaEntity } from "../grupo_apoyo_diagnostico/laboratorio_citologias_uterinas/criterio_lab_citologia_uterina.entity";
import { CriterioLabClinicoEntity } from "../grupo_apoyo_diagnostico/laboratorio_clinico/criterio_lab_clinico.entity";
import { CriterioLabHistotecnologiaEntity } from "../grupo_apoyo_diagnostico/laboratorio_histotecnologia/criterio_lab_histotec.entity";
import { CriterioMedicinaNuclearEntity } from "../grupo_apoyo_diagnostico/medicina_nuclear/criterio_medicina_nuclear.entity";
import { CriterioPatologiaEntity } from "../grupo_apoyo_diagnostico/patologia/criterio_patologia.entity";
import { CriterioQuimioterapiaEntity } from "../grupo_apoyo_diagnostico/quimioterapia/criterio_quimioterapia.entity";
import { CriterioRadiologiaOdontoEntity } from "../grupo_apoyo_diagnostico/radiologia_odont/criterio_radio_odont.entity";
import { CriterioRadioterapiaEntity } from "../grupo_apoyo_diagnostico/radioterapia/criterio_radioterapia.entity";
import { CriterioSerFarmaceuticoEntity } from "../grupo_apoyo_diagnostico/servicio_farmaceutico/criterios_s_farmaceutico.entity";
import { CriterioTerapiaEntity } from "../grupo_apoyo_diagnostico/terapias/criterios_terapias.entity";
import { CriterioCuelloUterinoEntity } from "../grupo_apoyo_diagnostico/toma_muestras_cuello_uterino/criterio_tom_muest_cuello.entity";
import { CriterioMuestraLabClinicoEntity } from "../grupo_apoyo_diagnostico/toma_muestras_laboratorio_clinico/criterio_tom_muestras.entity";
import { CriterioPartoEntity } from "../grupo_atencion_inmediata/parto/criterio_parto.entity";
import { CriterioPrehospitalariaEntity } from "../grupo_atencion_inmediata/prehospitalaria/criterio_prehospitalaria.entity";
import { CriterioTranspAsistencialEntity } from "../grupo_atencion_inmediata/transporte_asistencial/criterio_trans_asistencial.entity";
import { CriterioUrgenciasEntity } from "../grupo_atencion_inmediata/urgencias/criterio_urgencias.entity";
import { CriterioEspecializadaEntity } from "../grupo_consulta_externa/externa_especializada/criterio_especializada.entity";
import { CriterioConsumoPsicoactivasEntity } from "../grupo_internacion/cuidado_basico_consumo_psicoactivas/criterio_cuid_cons_psicoact.entity";
import { CriterioExternaGeneralEntity } from "../grupo_consulta_externa/externa_general/criterio_ext_general.entity";
import { CriterioVacunacionEntity } from "../grupo_consulta_externa/vacunacion/criterio_vacunacion.entity";
import { CriterioCuidBasNeonatalEntity } from "../grupo_internacion/cuidado_basico_neonatal/criterio_cuid_basic_neonatal.entity";
import { CriterioCuidIntensAdultoEntity } from "../grupo_internacion/cuidado_intensivo_adulto/criterio_cuid_intens_adulto.entity";
import { CriterioCuidInteNeonatalEntity } from "../grupo_internacion/cuidado_intensivo_neonatal/criterio_cuid_intens_neonatal.entity";
import { CriterioCuidIntePediatricoEntity } from "../grupo_internacion/cuidado_intensivo_pediatrico/criterio_cuid_intens_pediatrico.entity";
import { CriterioCuidIntermAdultoEntity } from "../grupo_internacion/cuidado_intermedio_adulto/criterio_cuid_inter_adulto.entity";
import { CriterioCuidIntermNeonatalEntity } from "../grupo_internacion/cuidado_intermedio_neonatal/criterio_cuid_inter_neonatal.entity";
import { CriterioCuidIntermPediatricoEntity } from "../grupo_internacion/cuidado_intermedio_pediatrico/criterio_cuid_inter_pediatrico.entity";
import { CriterioHospitalizacionEntity } from "../grupo_internacion/hospitalizacion/criterio_hospitalizacion.entity";
import { CriterioHospitCronicoEntity } from "../grupo_internacion/hospitalizacion_paciente_cronico/criterio_hosp_paciente_cron.entity";
import { CriterioHospitalizacionParcialEntity } from "../grupo_internacion/hospitalizacion_parcial/criterio_hosp_parcial.entity";
import { CriterioHospitalizacionMentalEntity } from "../grupo_internacion/hospitalizacion_salud_mental/criterio_hosp_salud_mental.entity";
import { CriterioCirugiaEntity } from "../grupo_quirurgico/cirugia/criterio_cirugia.entity";
import { Criterio_servicios } from "../todos_servicios/servicios/criterio_servicios.entity";


@Entity({ name: 'seccion' })
export class SeccionEntity {
    @PrimaryGeneratedColumn('increment')
    sec_id: number;

    @Column({ type: 'varchar', length: 3, nullable: false, unique: true })
    sec_number: string;


    //Relacion UNO a MUCHOS SECCION - CRITERIOS_DIAGNOSTICO_VASCULAR
    @OneToMany(type => CriterioDiagnostVascularEntity, diag_vas => diag_vas.diag_seccion)
    seccion_diag_vas: CriterioSaludTrabajoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS DIALISIS
    @OneToMany(type => CriterioDialisisEntity, dial => dial.dial_seccion)
    seccion_dial: CriterioDialisisEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS GESTION PRETANSFUNCIONAL
    @OneToMany(type => CriterioGestionPretransfusionalEntity, pretrans => pretrans.pretrans_seccion)
    seccion_pretrans: CriterioGestionPretransfusionalEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS HEMODINAMIA INTERVENISMO
    @OneToMany(type => CriterioHermoIntervenEntity, hermo => hermo.hermo_inver_seccion)
    seccion_hermo_inver: CriterioHermoIntervenEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS IMAGEN IONIZANTE
    @OneToMany(type => CriterioImgRadIonizantesEntity, ioni => ioni.ionizante_seccion)
    seccion_ionizante: CriterioImgRadIonizantesEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS IMAGEN IONIZANTE
    @OneToMany(type => CriterioImgRadNoIonizantesEntity, noioni => noioni.noionizante_seccion)
    seccion_noionizante: CriterioImgRadNoIonizantesEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS LAB CITOLOGIA UTERINA
    @OneToMany(type => CriterioLabUterinaEntity, uterinas => uterinas.lab_uterinas_seccion)
    seccion_lab_uterinas: CriterioLabUterinaEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS LAB CLINICO
    @OneToMany(type => CriterioLabClinicoEntity, clinico => clinico.lab_clinico_seccion)
    seccion_lab_clinico: CriterioLabClinicoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS LAB HISTOTEC
    @OneToMany(type => CriterioLabHistotecnologiaEntity, histo => histo.lab_histotec_seccion)
    seccion_lab_histotec: CriterioLabHistotecnologiaEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS MED NUCLEAR
    @OneToMany(type => CriterioMedicinaNuclearEntity, nuclear => nuclear.med_nuclear_seccion)
    seccion_med_nuclear: CriterioMedicinaNuclearEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS PATOLOGIA
    @OneToMany(type => CriterioPatologiaEntity, pato => pato.patologia_seccion)
    seccion_patologia: CriterioPatologiaEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS QUIMIOTERAPIA
    @OneToMany(type => CriterioQuimioterapiaEntity, quimio => quimio.quimioterapia_seccion)
    seccion_quimioterapia: CriterioQuimioterapiaEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS RADIOLOGIA ODONTOLOGICA
    @OneToMany(type => CriterioRadiologiaOdontoEntity, odonto => odonto.rad_odonto_seccion)
    seccion_rad_odonto: CriterioRadiologiaOdontoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS RADIOTERAPIA
    @OneToMany(type => CriterioRadioterapiaEntity, radio => radio.radio_seccion)
    seccion_radio: CriterioRadioterapiaEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS SERVICIO_FARMACEUTICO
    @OneToMany(type => CriterioSerFarmaceuticoEntity, farma => farma.serv_farm_seccion)
    seccion_serv_farm: CriterioSerFarmaceuticoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS TERAPIA
    @OneToMany(type => CriterioTerapiaEntity, tera => tera.terapia_seccion)
    seccion_terapia: CriterioTerapiaEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUELLO UTERINO
    @OneToMany(type => CriterioCuelloUterinoEntity, cuello => cuello.cuello_uterino_seccion)
    seccion_cuello_uterino: CriterioCuelloUterinoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS TOMA_MUESTRAS_LABORATORIO_CLINICO
    @OneToMany(type => CriterioMuestraLabClinicoEntity, clinico => clinico.tom_lab_clinico_seccion)
    seccion_tom_lab_clinico: CriterioMuestraLabClinicoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS PARTO
    @OneToMany(type => CriterioPartoEntity, parto => parto.parto_seccion)
    seccion_parto: CriterioPartoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS PREHOSPITALARIA
    @OneToMany(type => CriterioPrehospitalariaEntity, prehos => prehos.prehospi_seccion)
    seccion_prehospi: CriterioPrehospitalariaEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS TRANSPORTE_ASISTENCIAL
    @OneToMany(type => CriterioTranspAsistencialEntity, asistencial => asistencial.trans_asis_seccion)
    seccion_trans_asis: CriterioTranspAsistencialEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS URGENCIAS
    @OneToMany(type => CriterioUrgenciasEntity, urgen => urgen.urgencias_seccion)
    seccion_urgencias: CriterioUrgenciasEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS EXTERNA_ESPECIALIZADA
    @OneToMany(type => CriterioEspecializadaEntity, especial => especial.ext_especial_seccion)
    seccion_ext_especial: CriterioEspecializadaEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS EXTERNA_GENERAL
    @OneToMany(type => CriterioExternaGeneralEntity, general => general.ext_general_seccion)
    seccion_ext_general: CriterioExternaGeneralEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS SEGURIDAD Y SALUD EN EL TRABAJO 
    @OneToMany(type => CriterioSaludTrabajoEntity, salud => salud.salud_trabajo_seccion)
    seccion_salud_trabajo: CriterioSaludTrabajoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS VACUNACION
    @OneToMany(type => CriterioVacunacionEntity, salud => salud.vacunacion_seccion)
    seccion_vacunacion: CriterioVacunacionEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_BASICO_CONSUMO_PSICOACTIVAS
    @OneToMany(type => CriterioConsumoPsicoactivasEntity, psico => psico.cons_psico_seccion)
    seccion_cons_psico: CriterioConsumoPsicoactivasEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_BASICO_NEONATAL
    @OneToMany(type => CriterioCuidBasNeonatalEntity, bas_neo => bas_neo.basico_neonatal_seccion)
    seccion_basico_neonatal: CriterioCuidBasNeonatalEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntensAdultoEntity, adul_intens => adul_intens.intens_adulto_seccion)
    seccion_intens_adulto: CriterioCuidIntensAdultoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidInteNeonatalEntity, neo_intens => neo_intens.intens_neo_seccion)
    seccion_intens_neo: CriterioCuidInteNeonatalEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntePediatricoEntity, pedi_intens => pedi_intens.intens_pedi_seccion)
    seccion_intens_pedi: CriterioCuidIntePediatricoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntermAdultoEntity, adul_inter => adul_inter.inter_adulto_seccion)
    seccion_inter_adulto: CriterioCuidIntermAdultoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntermNeonatalEntity, neo_inter => neo_inter.inter_neo_seccion)
    seccion_inter_neo: CriterioCuidIntermNeonatalEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntermPediatricoEntity, pedi_inter => pedi_inter.inter_pedi_seccion)
    seccion_inter_pedi: CriterioCuidIntermPediatricoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioHospitalizacionEntity, hospi => hospi.hospitalizacion_seccion)
    seccion_hospitalizacion: CriterioHospitalizacionEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioHospitCronicoEntity, hospi_cronica => hospi_cronica.hosp_paciente_cro_seccion)
    seccion_hosp_paciente_cro: CriterioHospitCronicoEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioHospitalizacionParcialEntity, hospi_parcial => hospi_parcial.hosp_parcial_seccion)
    seccion_hosp_parcial: CriterioHospitalizacionParcialEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioHospitalizacionMentalEntity, hospi_sal_mental => hospi_sal_mental.hosp_salud_men_seccion)
    seccion_hosp_salud_men: CriterioHospitalizacionMentalEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCirugiaEntity, cirugia => cirugia.cirugia_seccion)
    seccion_cirugia: CriterioCirugiaEntity;

    //Relacion UNO a MUCHOS SECCION - CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => Criterio_servicios, servicios => servicios.todos_servi_seccion)
    seccion_todos_servi: Criterio_servicios;
}