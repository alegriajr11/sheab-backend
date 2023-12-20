import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GrupoEvaluacionEntity } from '../grupo_evaluacion/grupo_evaluacion.entity';
import { DiagnosticoVascularEntity } from '../evaluacion/grupo_apoyo_diagnostico/diagnostico_vascular/diagnostico_vascular.entity';
import { DialisisEntity } from '../evaluacion/grupo_apoyo_diagnostico/dialisis/dialisis.entity';
import { GestionPretransfusionalEntity } from '../evaluacion/grupo_apoyo_diagnostico/gestion_pretransfusional/gestion_pretrans.entity';
import { HermodIntervenEntity } from '../evaluacion/grupo_apoyo_diagnostico/hemodinamia_intervencionismo/hemod_interven.entity';
import { ImgRadIonizantesEntity } from '../evaluacion/grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_ionizantes/img_rad_ionizantes.entity';
import { ImgRadNoIonizantesEntity } from '../evaluacion/grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_noionizantes/img_rad_noionizantes.entity';
import { LabCitologiaUterinaEntity } from '../evaluacion/grupo_apoyo_diagnostico/laboratorio_citologias_uterinas/lab_citologia_uterina.entity';
import { LabClinicoEntity } from '../evaluacion/grupo_apoyo_diagnostico/laboratorio_clinico/laboratorio_clinico.entity';
import { LabHistotecnologiaEntity } from '../evaluacion/grupo_apoyo_diagnostico/laboratorio_histotecnologia/lab_histotecnologia.entity';
import { MedNuclearEntity } from '../evaluacion/grupo_apoyo_diagnostico/medicina_nuclear/medicina_nuclear.entity';
import { PatologiaEntity } from '../evaluacion/grupo_apoyo_diagnostico/patologia/patologia.entity';
import { QuimioterapiaEntity } from '../evaluacion/grupo_apoyo_diagnostico/quimioterapia/quimioterapia.entity';
import { RadiologiaOdontoEntity } from '../evaluacion/grupo_apoyo_diagnostico/radiologia_odont/radiologia_odont.entity';
import { RadioterapiaEntity } from '../evaluacion/grupo_apoyo_diagnostico/radioterapia/radioterapia.entity';
import { ServFarmaceuticoEntity } from '../evaluacion/grupo_apoyo_diagnostico/servicio_farmaceutico/servicio_farmaceutico.entity';
import { TerapiasEntity } from '../evaluacion/grupo_apoyo_diagnostico/terapias/terapias.entity';
import { CuelloUterinoEntity } from '../evaluacion/grupo_apoyo_diagnostico/toma_muestras_cuello_uterino/tom_muestras_cuello_uter.entity';
import { MuestrasLabClinicoEntity } from '../evaluacion/grupo_apoyo_diagnostico/toma_muestras_laboratorio_clinico/tom_muestras.entity';
import { PartoEntity } from '../evaluacion/grupo_atencion_inmediata/parto/parto.entity';
import { PrehospitalariaEntity } from '../evaluacion/grupo_atencion_inmediata/prehospitalaria/prehospitalaria.entity';
import { TranspAsistencialEntity } from '../evaluacion/grupo_atencion_inmediata/transporte_asistencial/transporte_asistencial.entity';
import { UrgenciasEntity } from '../evaluacion/grupo_atencion_inmediata/urgencias/urgencias.entity';
import { ExternaEspecializadaEntity } from '../evaluacion/grupo_consulta_externa/externa_especializada/especializada.entity';
import { ExternaGeneralEntity } from '../evaluacion/grupo_consulta_externa/externa_general/general.entity';
import { SaludTrabajoEntity } from '../evaluacion/grupo_consulta_externa/seguridad_salud_trabajo/salud_trabajo.entity';
import { VacunacionEntity } from '../evaluacion/grupo_consulta_externa/vacunacion/vacunacion.entity';
import { ConsumoPsicoactivasEntity } from '../evaluacion/grupo_internacion/cuidado_basico_consumo_psicoactivas/cuid_consumo_psicoactivas.entity';
import { CuidBasNeonatalEntity } from '../evaluacion/grupo_internacion/cuidado_basico_neonatal/cuid_basic_neonatal.entity';
import { CuidIntAdultoEntity } from '../evaluacion/grupo_internacion/cuidado_intensivo_adulto/cuid_intens_adulto.entity';
import { CuidInteNeonatalEntity } from '../evaluacion/grupo_internacion/cuidado_intensivo_neonatal/cuid_intens_neonatal.entity';
import { CuidIntePediatricoEntity } from '../evaluacion/grupo_internacion/cuidado_intensivo_pediatrico/cuid_intens_pediatrico.entity';
import { CuidIntermAdultoEntity } from '../evaluacion/grupo_internacion/cuidado_intermedio_adulto/cuid_inter_adulto.entity';
import { CuidIntermNeonatalEntity } from '../evaluacion/grupo_internacion/cuidado_intermedio_neonatal/cuid_inter_neonatal.entity';
import { CuidIntermPediatricoEntity } from '../evaluacion/grupo_internacion/cuidado_intermedio_pediatrico/cuid_inter_pediatrico.entity';
import { HospitalizacionEntity } from '../evaluacion/grupo_internacion/hospitalizacion/hospitalizacion.entity';
import { HospitalizacionCronicoEntity } from '../evaluacion/grupo_internacion/hospitalizacion_paciente_cronico/hospi_paciente_cronico.entity';
import { HospitalizacionParcialEntity } from '../evaluacion/grupo_internacion/hospitalizacion_parcial/hospitalizacion_parcial.entity';
import { HospitalizacionMentalEntity } from '../evaluacion/grupo_internacion/hospitalizacion_salud_mental/hosp_salud_mental.entity';
import { CirugiaEntity } from '../evaluacion/grupo_quirurgico/cirugia/cirugia.entity';
import { TodoServiciosEntity } from '../evaluacion/todos_servicios/servicios/todos_servicios.entity';

@Entity({ name: 'servicios' })
export class ServicioEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 105, nullable: false })
    nombre: string;

    @ManyToOne(type => GrupoEvaluacionEntity, evaluacion => evaluacion.servicios_evaluacion)
    evaluacion_servicios: GrupoEvaluacionEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON DIAGNOSTICO VASCULAR
    @OneToMany(() => DiagnosticoVascularEntity, diag_vas => diag_vas.diag_estan_servicios)
    servicios_diag: DiagnosticoVascularEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON DIALISIS
    @OneToMany(() => DialisisEntity, dialisis => dialisis.dial_estan_servicios)
    servicios_dial: DialisisEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON GESTION PRETRANSFUCIONAL
    @OneToMany(() => GestionPretransfusionalEntity, pretrans => pretrans.gestion_pretrans_estan_servicios)
    servicios_gestion_pretrans: GestionPretransfusionalEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON HEMODINAMIA INTERVENCIONISMO
    @OneToMany(() => HermodIntervenEntity, hemodinamia => hemodinamia.hemo_inter_estan_servicios)
    servicios_hemo_inter: HermodIntervenEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON IMAGENES DIAGNOSTICAS IONIZANTES
    @OneToMany(() => ImgRadIonizantesEntity, imag_ioni => imag_ioni.imag_ionizante_estan_servicios)
    servicios_imag_ionizante: ImgRadIonizantesEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON IMAGENES DIAGNOSTICAS NO IONIZANTES
    @OneToMany(() => ImgRadNoIonizantesEntity, imag_no_ioni => imag_no_ioni.imag_no_ionizante_estan_servicios)
    servicios_imag_no_ionizante: ImgRadNoIonizantesEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON LABORATORIO CITOLOGIAS UTERINAS
    @OneToMany(() => LabCitologiaUterinaEntity, citologia => citologia.lab_citologia_estan_servicios)
    servicios_lab_citologia: LabCitologiaUterinaEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON LABORATORIO CLINICO
    @OneToMany(() => LabClinicoEntity, clinico => clinico.lab_clinico_estan_servicios)
    servicios_lab_clinico: LabClinicoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON LABORATORIO HISTOTECNOLOGIA
    @OneToMany(() => LabHistotecnologiaEntity, histotec => histotec.lab_histotec_estan_servicios)
    servicios_lab_histotec: LabHistotecnologiaEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON MEDICINA NUCLEAR
    @OneToMany(() => MedNuclearEntity, nuclear => nuclear.medi_nuclear_estan_servicios)
    servicios_medi_nuclear: MedNuclearEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON PATOLOGIA
    @OneToMany(() => PatologiaEntity, pato => pato.patologia_estan_servicios)
    servicios_patologia: PatologiaEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON QUIMIOTERAPIA
    @OneToMany(() => QuimioterapiaEntity, quimio => quimio.quimioterapia_estan_servicios)
    servicios_quimioterapia: QuimioterapiaEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON RADIOLOGIA ODONTOLOGICA
    @OneToMany(() => RadiologiaOdontoEntity, rad_odonto => rad_odonto.odontologica_estan_servicios)
    servicios_odontologica: RadiologiaOdontoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON RADIOLOGIA ODONTOLOGICA
    @OneToMany(() => RadioterapiaEntity, radio => radio.radioterapia_estan_servicios)
    servicios_radioterapia: RadioterapiaEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON SERVICIO_FARMACEUTICO
    @OneToMany(() => ServFarmaceuticoEntity, servi => servi.servi_farma_estan_servicios)
    servicios_servi_farma: ServFarmaceuticoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON TERAPIA
    @OneToMany(() => TerapiasEntity, radio => radio.terapia_estan_servicios)
    servicios_terapia: TerapiasEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON TOMA_MUESTRAS_CUELLO_UTERINO
    @OneToMany(() => CuelloUterinoEntity, uterino => uterino.cuello_uterino_estan_servicios)
    servicios_cuello_uterino: CuelloUterinoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON TOMA_MUESTRAS_LABORATORIO_CLINICO
    @OneToMany(() => MuestrasLabClinicoEntity, clinico => clinico.toma_lab_clinico_estan_servicios)
    servicios_toma_lab_clinico: MuestrasLabClinicoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON PARTO
    @OneToMany(() => PartoEntity, parto => parto.parto_estan_servicios)
    servicios_parto: PartoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON PREHOSPITALARIA
    @OneToMany(() => PrehospitalariaEntity, prehospi => prehospi.prehospitalaria_estan_servicios)
    servicios_prehospitalaria: PrehospitalariaEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON TRANSPORTE_ASISTENCIAL
    @OneToMany(() => TranspAsistencialEntity, trans_asist => trans_asist.trans_asistencial_estan_servicios)
    servicios_trans_asistencial: TranspAsistencialEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON URGENCIAS
    @OneToMany(() => UrgenciasEntity, urgencias => urgencias.urgencias_estan_servicios)
    servicios_urgencias: UrgenciasEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON EXTERNA ESPECIALIZADA
    @OneToMany(() => ExternaEspecializadaEntity, especializada => especializada.ext_especializada_estan_servicios)
    servicios_ext_especializada: ExternaEspecializadaEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON EXTERNA GENERAL
    @OneToMany(() => ExternaGeneralEntity, general => general.ext_general_estan_servicios)
    servicios_ext_general: ExternaGeneralEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON SEGURIDAD Y SALUD EN EL TRABAJO
    @OneToMany(() => SaludTrabajoEntity, salud_trabajo => salud_trabajo.salud_trabajo_estan_servicios)
    servicios_salud_trabajo: SaludTrabajoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON VACUNACION
    @OneToMany(() => VacunacionEntity, vacunacion => vacunacion.vacunacion_estan_servicios)
    servicios_vacunacion: VacunacionEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CUIDADO_BASICO_CONSUMO_PSICOACTIVAS
    @OneToMany(() => ConsumoPsicoactivasEntity, psicoactivas => psicoactivas.cuidado_psicoactivas_estan_servicios)
    servicios_cuidado_psicoactivas: ConsumoPsicoactivasEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CUIDADO_BASICO_NEONATAL
    @OneToMany(() => CuidBasNeonatalEntity, neonatal => neonatal.cuidado_neonatal_estan_servicios)
    servicios_cuidado_neonatal: CuidBasNeonatalEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CUIDADO_CUIDADO_INTENSIVO_ADULTO
    @OneToMany(() => CuidIntAdultoEntity, inte_adulto => inte_adulto.cuidado_intens_adulto_estan_servicios)
    servicios_cuidado_intens_adulto: CuidIntAdultoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CUIDADO_INTENSIVO_NEONATAL
    @OneToMany(() => CuidInteNeonatalEntity, inte_neonatal => inte_neonatal.cuidado_intens_neonatal_estan_servicios)
    servicios_cuidado_intens_neonatal: CuidInteNeonatalEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CUIDADO_INTENSIVO_PEDIATRICO
    @OneToMany(() => CuidIntePediatricoEntity, inte_pediatrico => inte_pediatrico.cuidado_intens_pediatrico_estan_servicios)
    servicios_cuidado_intens_pediatrico: CuidIntePediatricoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CUIDADO_CUIDADO_INTERMEDIO_ADULTO
    @OneToMany(() => CuidIntermAdultoEntity, inter_adulto => inter_adulto.cuidado_inter_adulto_estan_servicios)
    servicios_cuidado_inter_adulto: CuidIntermAdultoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CUIDADO_CUIDADO_INTERMEDIO_NEONATAL
    @OneToMany(() => CuidIntermNeonatalEntity, inter_neonatal => inter_neonatal.cuidado_inter_neonatal_estan_servicios)
    servicios_cuidado_inter_neonatal: CuidIntermNeonatalEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CUIDADO_CUIDADO_INTERMEDIO_PEDIATRICO
    @OneToMany(() => CuidIntermPediatricoEntity, inter_pediatrico => inter_pediatrico.cuidado_inter_pediatrico_estan_servicios)
    servicios_cuidado_inter_pediatrico: CuidIntermPediatricoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON HOSPITALIZACION
    @OneToMany(() => HospitalizacionEntity, hospi => hospi.hospitalizacion_estan_servicios)
    servicios_hospitalizacion: HospitalizacionEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON HOSPITALIZACION_CRONICO
    @OneToMany(() => HospitalizacionCronicoEntity, hospi_cronico => hospi_cronico.hospi_cronico_estan_servicios)
    servicios_hospi_cronico: HospitalizacionCronicoEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON HOSPITALIZACION_PARCIAL
    @OneToMany(() => HospitalizacionParcialEntity, hospi_parcial => hospi_parcial.hospi_parcial_estan_servicios)
    servicios_hospi_parcial: HospitalizacionParcialEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON HOSPITALIZACION_MENTAL
    @OneToMany(() => HospitalizacionMentalEntity, hospi_mental => hospi_mental.hospi_mental_estan_servicios)
    servicios_hospi_mental: HospitalizacionMentalEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CIRUGUA
    @OneToMany(() => CirugiaEntity, cirugia => cirugia.cirugia_estan_servicios)
    servicios_cirugia: CirugiaEntity;

    //RELACION UNO A MUCHOS DE SERVICIOS CON CIRUGUA
    @OneToMany(() => TodoServiciosEntity, hospi_mental => hospi_mental.todos_servicios_estan_servicios)
    servicios_todos_servicios: TodoServiciosEntity;
}