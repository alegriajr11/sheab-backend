import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CriterioDiagnostVascularEntity } from "../grupo_apoyo_diagnostico/diagnostico_vascular/criterio_diagnost_vascular.entity";
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
import { CriterioSaludTrabajoEntity } from "../grupo_consulta_externa/seguridad_salud_trabajo/criterios_salud_trabajo.entity";
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



@Entity({ name: 'apartado' }) 
export class ApartadoEntity {
    @PrimaryColumn({ type: 'varchar', length: 10, nullable: false, unique: false })
    apa_codigo: string;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS_DIAGNOSTICO_VASCULAR
    @OneToMany(type => CriterioDiagnostVascularEntity, diag_vas => diag_vas.diag_apartado)
    apartado_diag_vas: CriterioDiagnostVascularEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS DIALISIS
    @OneToMany(type => CriterioDialisisEntity, dial => dial.dial_apartado)
    apartado_dial: CriterioDialisisEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS GESTION PRETANSFUNCIONAL
    @OneToMany(type => CriterioGestionPretransfusionalEntity, pretans => pretans.pretrans_apartado)
    apartado_pretrans: CriterioGestionPretransfusionalEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS HEMODINAMIA INTERVENISMO
    @OneToMany(type => CriterioHermoIntervenEntity, hermo => hermo.hermo_inver_apartado)
    apartado_hermo_inver: CriterioHermoIntervenEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS IMAGEN IONIZANTE
    @OneToMany(type => CriterioImgRadIonizantesEntity, ioni => ioni.ionizante_apartado)
    apartado_ionizante: CriterioImgRadIonizantesEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS IMAGEN IONIZANTE
    @OneToMany(type => CriterioImgRadNoIonizantesEntity, noioni => noioni.noionizante_apartado)
    apartado_noionizante: CriterioImgRadNoIonizantesEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS LAB CITOLOGIA UTERINA
    @OneToMany(type => CriterioLabUterinaEntity, uterinas => uterinas.lab_uterinas_apartado)
    apartado_lab_uterinas: CriterioLabUterinaEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS LAB CLINICO
    @OneToMany(type => CriterioLabClinicoEntity, clinico => clinico.lab_clinico_apartado)
    apartado_lab_clinico: CriterioLabClinicoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS LAB HISTOTEC
    @OneToMany(type => CriterioLabHistotecnologiaEntity, histo => histo.lab_histotec_apartado)
    apartado_lab_histotec: CriterioLabHistotecnologiaEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS MED NUCLEAR
    @OneToMany(type => CriterioMedicinaNuclearEntity, nuclear => nuclear.med_nuclear_apartado)
    apartado_med_nuclear: CriterioMedicinaNuclearEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS PATOLOGIA
    @OneToMany(type => CriterioPatologiaEntity, pato => pato.patologia_apartado)
    apartado_patologia: CriterioPatologiaEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS QUIMIOTERAPIA
    @OneToMany(type => CriterioQuimioterapiaEntity, quimio => quimio.quimioterapia_apartado)
    apartado_quimioterapia: CriterioQuimioterapiaEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS RADIOLOGIA ODONTOLOGICA
    @OneToMany(type => CriterioRadiologiaOdontoEntity, odonto => odonto.rad_odonto_apartado)
    apartado_rad_odonto: CriterioRadiologiaOdontoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS RADIOTERAPIA
    @OneToMany(type => CriterioRadioterapiaEntity, radio => radio.radio_apartado)
    apartado_radio: CriterioRadioterapiaEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS SERVICIO_FARMACEUTICO
    @OneToMany(type => CriterioSerFarmaceuticoEntity, farma => farma.serv_farm_apartado)
    apartado_serv_farm: CriterioSerFarmaceuticoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS TERAPIA
    @OneToMany(type => CriterioTerapiaEntity, tera => tera.terapia_apartado)
    apartado_terapia: CriterioTerapiaEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUELLO UTERINO
    @OneToMany(type => CriterioCuelloUterinoEntity, cuello => cuello.cuello_uterino_apartado)
    apartado_cuello_uterino: CriterioCuelloUterinoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS TOMA_MUESTRAS_LABORATORIO_CLINICO
    @OneToMany(type => CriterioMuestraLabClinicoEntity, lab_clinico => lab_clinico.tom_lab_clinico_apartado)
    apartado_tom_lab_clinico: CriterioMuestraLabClinicoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS PARTO
    @OneToMany(type => CriterioPartoEntity, lab_clinico => lab_clinico.parto_apartado)
    apartado_parto: CriterioPartoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS PREHOSPITALARIA
    @OneToMany(type => CriterioPrehospitalariaEntity, prehos => prehos.prehospi_apartado)
    apartado_prehospi: CriterioPrehospitalariaEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS TRANSPORTE_ASISTENCIAL
    @OneToMany(type => CriterioTranspAsistencialEntity, asistencial => asistencial.trans_asis_apartado)
    apartado_trans_asis: CriterioTranspAsistencialEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS URGENCIAS
    @OneToMany(type => CriterioUrgenciasEntity, urgen => urgen.urgencias_apartado)
    apartado_urgencias: CriterioUrgenciasEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS EXTERNA_ESPECIALIZADA
    @OneToMany(type => CriterioEspecializadaEntity, especia => especia.ext_especial_apartado)
    apartado_ext_especial: CriterioEspecializadaEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS EXTERNA_GENERAL
    @OneToMany(type => CriterioExternaGeneralEntity, general => general.ext_general_apartado)
    apartado_ext_general: CriterioExternaGeneralEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS SEGURIDAD Y SALUD EN EL TRABAJO 
    @OneToMany(type => CriterioSaludTrabajoEntity, salud => salud.salud_trabajo_apartado)
    apartado_salud_trabajo: CriterioSaludTrabajoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS VACUNACION
    @OneToMany(type => CriterioVacunacionEntity, salud => salud.vacunacion_apartado)
    apartado_vacunacion: CriterioVacunacionEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_BASICO_CONSUMO_PSICOACTIVAS
    @OneToMany(type => CriterioConsumoPsicoactivasEntity, psico => psico.cons_psico_apartado)
    apartado_cons_psico: CriterioConsumoPsicoactivasEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_BASICO_NEONATAL
    @OneToMany(type => CriterioCuidBasNeonatalEntity, bas_neo => bas_neo.basico_neonatal_apartado)
    apartado_basico_neonatal: CriterioCuidBasNeonatalEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntensAdultoEntity, adul_intens => adul_intens.intens_adulto_apartado)
    apartado_intens_adulto: CriterioCuidIntensAdultoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidInteNeonatalEntity, neo_intens => neo_intens.intens_neo_apartado)
    apartado_intens_neo: CriterioCuidInteNeonatalEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntePediatricoEntity, pedi_intens => pedi_intens.intens_pedi_apartado)
    apartado_intens_pedi: CriterioCuidIntePediatricoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntermAdultoEntity, adul_inter => adul_inter.inter_adulto_apartado)
    apartado_inter_adulto: CriterioCuidIntermAdultoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntermNeonatalEntity, neo_inter => neo_inter.inter_neo_apartado)
    apartado_inter_neo: CriterioCuidIntermNeonatalEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntermPediatricoEntity, pedi_inter => pedi_inter.inter_pedi_aparto)
    apartado_inter_pedi: CriterioCuidIntermPediatricoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioHospitalizacionEntity, hospi => hospi.hospitalizacion_aparto)
    apartado_hospitalizacion: CriterioHospitalizacionEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioHospitCronicoEntity, hospi_cro => hospi_cro.hosp_paciente_cro_aparto)
    apartado_hosp_paciente_cro: CriterioHospitCronicoEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioHospitalizacionParcialEntity, hospi_parcial => hospi_parcial.hosp_parcial_aparto)
    apartado_hosp_parcial: CriterioHospitalizacionParcialEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioHospitalizacionMentalEntity, hospi_mental => hospi_mental.hosp_salud_men_aparto)
    apartado_hosp_salud_men: CriterioHospitalizacionMentalEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CIRUGIA
    @OneToMany(type => CriterioCirugiaEntity, todos_servi => todos_servi.cirugia_aparto)
    apartado_cirugia: CriterioCirugiaEntity;

    //Relacion UNO a MUCHOS APARTADO -CRITERIOS CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => Criterio_servicios, todos_servi => todos_servi.todos_servi_aparto)
    apartado_todos_servi: Criterio_servicios;


}