/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolModule } from './rol/rol.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PrestadorModule } from './prestador/prestador.module';
import { MunicipioModule } from './municipio/municipio.module';
import { CriteriosicModule } from './sic/criteriosic/criteriosic.module';
import { ActividadModule } from './pamec/actividad/actividad.module';
import { SpIndModule } from './sp/sp_ind/sp_ind.module';
import { EvaluacionipsModule } from './sp/sp_ips/evaluacionips/evaluacionips.module';
import { CriterioajusteModule } from './sp/sp_ips/criterioajuste/criterioajuste.module';
import { CriterioimpleModule } from './sp/sp_ips/criterioimple/criterioimple.module';
import { CriterioverifModule } from './sp/sp_ips/criterioverif/criterioverif.module';
import { ItemipsModule } from './sp/sp_ips/itemips/itemips.module';
import { PlaneacionModule } from './sp/sp_ips/planeacion/planeacion.module';
import { GenerarpdfModule } from './generarpdf/generarpdf.module';
import { CalificacionpamecModule } from './pamec/calificacionpamec/calificacionpamec.module';
import { CriteriosicCumplimientoModule } from './sic/criteriosic-cumplimiento/criteriosic-cumplimiento.module';
import { CriterioServiciosController } from './resolucion/evaluacion/todos_servicios/criterio_servicios/criterio_servicios.controller';
import { CriterioServiciosModule } from './resolucion/evaluacion/todos_servicios/criterio_servicios/criterio_servicios.module';
import { CriteriosExtGeneralController } from './resolucion/evaluacion/grupo_consulta_externa/externa_general/criterios_ext_general/criterios_ext_general.controller';
import { CriteriosExtGeneralModule } from './resolucion/evaluacion/grupo_consulta_externa/externa_general/criterios_ext_general/criterios_ext_general.module';
import { CriteriosExtEspecializadaController } from './resolucion/evaluacion/grupo_consulta_externa/externa_especializada/criterios_ext_especializada/criterios_ext_especializada.controller';
import { CriteriosExtEspecializadaModule } from './resolucion/evaluacion/grupo_consulta_externa/externa_especializada/criterios_ext_especializada/criterios_ext_especializada.module';
import { CriteriosVacunacionController } from './resolucion/evaluacion/grupo_consulta_externa/vacunacion/criterios_vacunacion/criterios_vacunacion.controller';
import { CriteriosVacunacionModule } from './resolucion/evaluacion/grupo_consulta_externa/vacunacion/criterios_vacunacion/criterios_vacunacion.module';
import { CriteriosSaludTrabajoController } from './resolucion/evaluacion/grupo_consulta_externa/seguridad_salud_trabajo/criterios_salud_trabajo/criterios_salud_trabajo.controller';
import { CriteriosSaludTrabajoModule } from './resolucion/evaluacion/grupo_consulta_externa/seguridad_salud_trabajo/criterios_salud_trabajo/criterios_salud_trabajo.module';
import { CriterioTerapiasController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/terapias/criterio_terapias/criterio_terapias.controller';
import { CriterioTerapiasModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/terapias/criterio_terapias/criterio_terapias.module';
import { CriterioSFarmaceuticoController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/servicio_farmaceutico/criterio_s_farmaceutico/criterio_s_farmaceutico.controller';
import { CriterioSFarmaceuticoModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/servicio_farmaceutico/criterio_s_farmaceutico/criterio_s_farmaceutico.module';
import { CriterioRadioOdontController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/radiologia_odont/criterio_radio_odont/criterio_radio_odont.controller';
import { CriterioRadioOdontModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/radiologia_odont/criterio_radio_odont/criterio_radio_odont.module';
import { CriterioImgRadIonizantesController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_ionizantes/criterio_img_rad_ionizantes/criterio_img_rad_ionizantes.controller';
import { CriterioImgRadIonizantesModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_ionizantes/criterio_img_rad_ionizantes/criterio_img_rad_ionizantes.module';
import { CriterioImgRadNoionizantesController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_noionizantes/criterio_img_rad_noionizantes/criterio_img_rad_noionizantes.controller';
import { CriterioImgRadNoionizantesModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_noionizantes/criterio_img_rad_noionizantes/criterio_img_rad_noionizantes.module';
import { CriterioMedicinaNuclearController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/medicina_nuclear/criterio_medicina_nuclear/criterio_medicina_nuclear.controller';
import { CriterioMedicinaNuclearModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/medicina_nuclear/criterio_medicina_nuclear/criterio_medicina_nuclear.module';
import { CriterioRadioterapiaController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/radioterapia/criterio_radioterapia/criterio_radioterapia.controller';
import { CriterioRadioterapiaModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/radioterapia/criterio_radioterapia/criterio_radioterapia.module';
import { CriterioQuimioterapiaController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/quimioterapia/criterio_quimioterapia/criterio_quimioterapia.controller';
import { CriterioQuimioterapiaModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/quimioterapia/criterio_quimioterapia/criterio_quimioterapia.module';
import { CriterioDiagnostVascularController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/diagnostico_vascular/criterio_diagnost_vascular/criterio_diagnost_vascular.controller';
import { CriterioDiagnostVascularModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/diagnostico_vascular/criterio_diagnost_vascular/criterio_diagnost_vascular.module';
import { CriteriosHemodIntervenController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/hemodinamia_intervencionismo/criterios_hemod_interven/criterios_hemod_interven.controller';
import { CriteriosHemodIntervenModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/hemodinamia_intervencionismo/criterios_hemod_interven/criterios_hemod_interven.module';
import { CriteriosGestionPretransController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/gestion_pretransfusional/criterios_gestion_pretrans/criterios_gestion_pretrans.controller';
import { CriteriosGestionPretransModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/gestion_pretransfusional/criterios_gestion_pretrans/criterios_gestion_pretrans.module';
import { CriteriosTomMuestrasController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/toma_muestras_laboratorio_clinico/criterios_tom_muestras/criterios_tom_muestras.controller';
import { CriteriosTomMuestrasModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/toma_muestras_laboratorio_clinico/criterios_tom_muestras/criterios_tom_muestras.module';
import { CriteriosLabClinicoController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/laboratorio_clinico/criterios_lab_clinico/criterios_lab_clinico.controller';
import { CriteriosLabClinicoModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/laboratorio_clinico/criterios_lab_clinico/criterios_lab_clinico.module';
import { CriteriosMuesCuelloController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/toma_muestras_cuello_uterino/criterios_mues_cuello/criterios_mues_cuello.controller';
import { CriteriosMuesCuelloModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/toma_muestras_cuello_uterino/criterios_mues_cuello/criterios_mues_cuello.module';
import { CriteriosLabCitologiaController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/laboratorio_citologias_uterinas/criterios_lab_citologia/criterios_lab_citologia.controller';
import { CriteriosLabCitologiaModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/laboratorio_citologias_uterinas/criterios_lab_citologia/criterios_lab_citologia.module';
import { CriteriosLabHistotecnologiaController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/laboratorio_histotecnologia/criterios_lab_histotecnologia/criterios_lab_histotecnologia.controller';
import { CriteriosLabHistotecnologiaModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/laboratorio_histotecnologia/criterios_lab_histotecnologia/criterios_lab_histotecnologia.module';
import { CriteriosPatologiaController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/patologia/criterios_patologia/criterios_patologia.controller';
import { CriteriosPatologiaModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/patologia/criterios_patologia/criterios_patologia.module';
import { CriteriosDialisisController } from './resolucion/evaluacion/grupo_apoyo_diagnostico/dialisis/criterios_dialisis/criterios_dialisis.controller';
import { CriteriosDialisisModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/dialisis/criterios_dialisis/criterios_dialisis.module';
import { CriteriosHospPacienteCronicoController } from './resolucion/evaluacion/grupo_internacion/hospitalizacion_paciente_cronico/criterios_hosp_paciente_cronico/criterios_hosp_paciente_cronico.controller';
import { CriteriosHospPacienteCronicoModule } from './resolucion/evaluacion/grupo_internacion/hospitalizacion_paciente_cronico/criterios_hosp_paciente_cronico/criterios_hosp_paciente_cronico.module';
import { CriteriosCuidBasicNeonatalController } from './resolucion/evaluacion/grupo_internacion/cuidado_basico_neonatal/criterios_cuid_basic_neonatal/criterios_cuid_basic_neonatal.controller';
import { CriteriosCuidBasicNeonatalModule } from './resolucion/evaluacion/grupo_internacion/cuidado_basico_neonatal/criterios_cuid_basic_neonatal/criterios_cuid_basic_neonatal.module';
import { CriteriosCuidInterNeonatalController } from './resolucion/evaluacion/grupo_internacion/cuidado_intermedio_neonatal/criterios_cuid_inter_neonatal/criterios_cuid_inter_neonatal.controller';
import { CriteriosCuidInterNeonatalModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intermedio_neonatal/criterios_cuid_inter_neonatal/criterios_cuid_inter_neonatal.module';
import { CriteriosCuidIntensNeonatalController } from './resolucion/evaluacion/grupo_internacion/cuidado_intensivo_neonatal/criterios_cuid_intens_neonatal/criterios_cuid_intens_neonatal.controller';
import { CriteriosCuidIntensNeonatalModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intensivo_neonatal/criterios_cuid_intens_neonatal/criterios_cuid_intens_neonatal.module';
import { CriteriosCuidInterPediatricoController } from './resolucion/evaluacion/grupo_internacion/cuidado_intermedio_pediatrico/criterios_cuid_inter_pediatrico/criterios_cuid_inter_pediatrico.controller';
import { CriteriosCuidInterPediatricoModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intermedio_pediatrico/criterios_cuid_inter_pediatrico/criterios_cuid_inter_pediatrico.module';
import { CriteriosCuidIntensPediatricoController } from './resolucion/evaluacion/grupo_internacion/cuidado_intensivo_pediatrico/criterios_cuid_intens_pediatrico/criterios_cuid_intens_pediatrico.controller';
import { CriteriosCuidIntensPediatricoModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intensivo_pediatrico/criterios_cuid_intens_pediatrico/criterios_cuid_intens_pediatrico.module';
import { CriteriosCuidInterAdultoController } from './resolucion/evaluacion/grupo_internacion/cuidado_intermedio_adulto/criterios_cuid_inter_adulto/criterios_cuid_inter_adulto.controller';
import { CriteriosCuidInterAdultoModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intermedio_adulto/criterios_cuid_inter_adulto/criterios_cuid_inter_adulto.module';
import { CriteriosCuidIntensAdultoController } from './resolucion/evaluacion/grupo_internacion/cuidado_intensivo_adulto/criterios_cuid_intens_adulto/criterios_cuid_intens_adulto.controller';
import { CriteriosCuidIntensAdultoModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intensivo_adulto/criterios_cuid_intens_adulto/criterios_cuid_intens_adulto.module';
import { CriteriosHospSaludMentalController } from './resolucion/evaluacion/grupo_internacion/hospitalizacion_salud_mental/criterios_hosp_salud_mental/criterios_hosp_salud_mental.controller';
import { CriteriosHospSaludMentalModule } from './resolucion/evaluacion/grupo_internacion/hospitalizacion_salud_mental/criterios_hosp_salud_mental/criterios_hosp_salud_mental.module';
import { CriteriosHospParcialController } from './resolucion/evaluacion/grupo_internacion/hospitalizacion_parcial/criterios_hosp_parcial/criterios_hosp_parcial.controller';
import { CriteriosHospParcialModule } from './resolucion/evaluacion/grupo_internacion/hospitalizacion_parcial/criterios_hosp_parcial/criterios_hosp_parcial.module';
import { CriteriosConsPsicoactivasController } from './resolucion/evaluacion/grupo_internacion/cuidado_basico_consumo_psicoactivas/criterios_cons_psicoactivas/criterios_cons_psicoactivas.controller';
import { CriteriosConsPsicoactivasModule } from './resolucion/evaluacion/grupo_internacion/cuidado_basico_consumo_psicoactivas/criterios_cons_psicoactivas/criterios_cons_psicoactivas.module';
import { CriteriosCirugiaController } from './resolucion/evaluacion/grupo_quirurgico/cirugia/criterios_cirugia/criterios_cirugia.controller';
import { CriteriosCirugiaModule } from './resolucion/evaluacion/grupo_quirurgico/cirugia/criterios_cirugia/criterios_cirugia.module';
import { CriteriosUrgenciasController } from './resolucion/evaluacion/grupo_atencion_inmediata/urgencias/criterios_urgencias/criterios_urgencias.controller';
import { CriteriosUrgenciasModule } from './resolucion/evaluacion/grupo_atencion_inmediata/urgencias/criterios_urgencias/criterios_urgencias.module';
import { CriteriosTransAsistencialController } from './resolucion/evaluacion/grupo_atencion_inmediata/transporte_asistencial/criterios_trans_asistencial/criterios_trans_asistencial.controller';
import { CriteriosTransAsistencialModule } from './resolucion/evaluacion/grupo_atencion_inmediata/transporte_asistencial/criterios_trans_asistencial/criterios_trans_asistencial.module';
import { CriteriosPrehospitalariaController } from './resolucion/evaluacion/grupo_atencion_inmediata/prehospitalaria/criterios_prehospitalaria/criterios_prehospitalaria.controller';
import { CriteriosPrehospitalariaModule } from './resolucion/evaluacion/grupo_atencion_inmediata/prehospitalaria/criterios_prehospitalaria/criterios_prehospitalaria.module';
import { CriteriosPartoController } from './resolucion/evaluacion/grupo_atencion_inmediata/parto/criterios_parto/criterios_parto.controller';
import { CriteriosPartoModule } from './resolucion/evaluacion/grupo_atencion_inmediata/parto/criterios_parto/criterios_parto.module';
import { CriterioHospitalizacionModule } from './resolucion/evaluacion/grupo_internacion/hospitalizacion/criterio_hospitalizacion/criterio_hospitalizacion.module';
import { CapacidadInstaladaModule } from './resolucion/servicios_capacidad/capacidad_instalada/capacidad_instalada.module';
import { ServiciosVerificadosModule } from './resolucion/servicios_capacidad/servicios_verificados/servicios_verificados.module';
import { CapacidadInstaladaController } from './resolucion/servicios_capacidad/capacidad_instalada/capacidad_instalada.controller';
import { GenerarExcelModule } from './generar_excel/generar_excel.module';
import { EvaluacionSicModule } from './sic/evaluacion-sic/evaluacion-sic.module';
import { AuditoriaRegistroModule } from './auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from './auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from './auditoria/auditoria_eliminacion/auditoria_eliminacion.module';
import { AuditoriaRegistroController } from './auditoria/auditoria_registro/auditoria_registro.controller';
import { GrupoEvaluacionModule } from './resolucion/grupo_evaluacion/grupo_evaluacion.module';
import { ServicioModule } from './resolucion/servicio/servicio.module';
import { CumplimientosicModule } from './sic/cumplimientosic/cumplimientosic.module';
import { CalificacionipsAjusteModule } from './sp/sp_ips/calificacion/calificacionips_ajuste/calificacionips_ajuste.module';
import { CalificacionipsImplementacionModule } from './sp/sp_ips/calificacion/calificacionips_implementacion/calificacionips_implementacion.module';
import { CalificacionipsPlaneacionModule } from './sp/sp_ips/calificacion/calificacionips_planeacion/calificacionips_planeacion.module';
import { CalificacionipsVerificacionModule } from './sp/sp_ips/calificacion/calificacionips_verificacion/calificacionips_verificacion.module';
import { EvaluacionpamecModule } from './pamec/evaluacionpamec/evaluacionpamec.module';
import { CumplimientoDiagVascularModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/diagnostico_vascular/cumplimiento_diag_vascular/cumplimiento_diag_vascular.module';
import { CumplimientoDialisisModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/dialisis/cumplimiento_dialisis/cumplimiento_dialisis.module';
import { CumplimientoGestionPretransModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/gestion_pretransfusional/cumplimiento_gestion_pretrans/cumplimiento_gestion_pretrans.module';
import { CumplimientoHemodIntervenModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/hemodinamia_intervencionismo/cumplimiento_hemod_interven/cumplimiento_hemod_interven.module';
import { CumplimientoImgRadIonizantesModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_ionizantes/cumplimiento_img_rad_ionizantes/cumplimiento_img_rad_ionizantes.module';
import { CumplimientoImgRadNoionizantesModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/imagenes_diagnosticas_rad_noionizantes/cumplimiento_img_rad_noionizantes/cumplimiento_img_rad_noionizantes.module';
import { CumplimientoLabCitologiaModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/laboratorio_citologias_uterinas/cumplimiento_lab_citologia/cumplimiento_lab_citologia.module';
import { CumplimientoLabClinicoModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/laboratorio_clinico/cumplimiento_lab_clinico/cumplimiento_lab_clinico.module';
import { CumplimientoLabHistotecnologiaModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/laboratorio_histotecnologia/cumplimiento_lab_histotecnologia/cumplimiento_lab_histotecnologia.module';
import { CumplimientoMedicinaNuclearModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/medicina_nuclear/cumplimiento_medicina_nuclear/cumplimiento_medicina_nuclear.module';
import { CumplimientoPatologiaModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/patologia/cumplimiento_patologia/cumplimiento_patologia.module';
import { CumplimientoQuimioterapiaModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/quimioterapia/cumplimiento_quimioterapia/cumplimiento_quimioterapia.module';
import { CumplimientoServicioFarmaceuticoModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/servicio_farmaceutico/cumplimiento_servicio_farmaceutico/cumplimiento_servicio_farmaceutico.module';
import { CumplimientoTerapiasModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/terapias/cumplimiento_terapias/cumplimiento_terapias.module';
import { CumplimientoMuesCuelloModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/toma_muestras_cuello_uterino/cumplimiento_mues_cuello/cumplimiento_mues_cuello.module';
import { CumplimientoTomMuestrasModule } from './resolucion/evaluacion/grupo_apoyo_diagnostico/toma_muestras_laboratorio_clinico/cumplimiento_tom_muestras/cumplimiento_tom_muestras.module';
import { CumplimientoPartoModule } from './resolucion/evaluacion/grupo_atencion_inmediata/parto/cumplimiento_parto/cumplimiento_parto.module';
import { CumplimientoPrehospitalariaModule } from './resolucion/evaluacion/grupo_atencion_inmediata/prehospitalaria/cumplimiento_prehospitalaria/cumplimiento_prehospitalaria.module';
import { CumplimientoTransAsistencialModule } from './resolucion/evaluacion/grupo_atencion_inmediata/transporte_asistencial/cumplimiento_trans_asistencial/cumplimiento_trans_asistencial.module';
import { CumplimientoUrgenciasModule } from './resolucion/evaluacion/grupo_atencion_inmediata/urgencias/cumplimiento_urgencias/cumplimiento_urgencias.module';
import { CumplimientoExtEspecializadaModule } from './resolucion/evaluacion/grupo_consulta_externa/externa_especializada/cumplimiento_ext_especializada/cumplimiento_ext_especializada.module';
import { CumplimientoExtGeneralModule } from './resolucion/evaluacion/grupo_consulta_externa/externa_general/cumplimiento_ext_general/cumplimiento_ext_general.module';
import { CumplimientoSaludTrabajoModule } from './resolucion/evaluacion/grupo_consulta_externa/seguridad_salud_trabajo/cumplimiento_salud_trabajo/cumplimiento_salud_trabajo.module';
import { CumplimientoVacunacionModule } from './resolucion/evaluacion/grupo_consulta_externa/vacunacion/cumplimiento_vacunacion/cumplimiento_vacunacion.module';
import { CumplimientoConsPsicoactivasModule } from './resolucion/evaluacion/grupo_internacion/cuidado_basico_consumo_psicoactivas/cumplimiento_cons_psicoactivas/cumplimiento_cons_psicoactivas.module';
import { CumplimientoCuidBasicNeonatalModule } from './resolucion/evaluacion/grupo_internacion/cuidado_basico_neonatal/cumplimiento_cuid_basic_neonatal/cumplimiento_cuid_basic_neonatal.module';
import { CumplimientoCuidIntensAdultoModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intensivo_adulto/cumplimiento_cuid_intens_adulto/cumplimiento_cuid_intens_adulto.module';
import { CumplimientoCuidIntensNeonatalModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intensivo_neonatal/cumplimiento_cuid_intens_neonatal/cumplimiento_cuid_intens_neonatal.module';
import { CumplimientoCuidIntensPediatricoModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intensivo_pediatrico/cumplimiento_cuid_intens_pediatrico/cumplimiento_cuid_intens_pediatrico.module';
import { CumplimientoCuidInterAdultoModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intermedio_adulto/cumplimiento_cuid_inter_adulto/cumplimiento_cuid_inter_adulto.module';
import { CumplimientoCuidInterNeonatalModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intermedio_neonatal/cumplimiento_cuid_inter_neonatal/cumplimiento_cuid_inter_neonatal.module';
import { CumplimientoCuidInterPediatricoModule } from './resolucion/evaluacion/grupo_internacion/cuidado_intermedio_pediatrico/cumplimiento_cuid_inter_pediatrico/cumplimiento_cuid_inter_pediatrico.module';
import { CumplimientoHospitalizacionModule } from './resolucion/evaluacion/grupo_internacion/hospitalizacion/cumplimiento_hospitalizacion/cumplimiento_hospitalizacion.module';
import { CumplimientoHospPacienteCronicoModule } from './resolucion/evaluacion/grupo_internacion/hospitalizacion_paciente_cronico/cumplimiento_hosp_paciente_cronico/cumplimiento_hosp_paciente_cronico.module';
import { CumplimientoHospParcialModule } from './resolucion/evaluacion/grupo_internacion/hospitalizacion_parcial/cumplimiento_hosp_parcial/cumplimiento_hosp_parcial.module';
import { CumplimientoHospSaludMentalModule } from './resolucion/evaluacion/grupo_internacion/hospitalizacion_salud_mental/cumplimiento_hosp_salud_mental/cumplimiento_hosp_salud_mental.module';
import { CumplimientoCirugiaModule } from './resolucion/evaluacion/grupo_quirurgico/cirugia/cumplimiento_cirugia/cumplimiento_cirugia.module';
import { CumplimientoTodosServiciosModule } from './resolucion/evaluacion/todos_servicios/cumplimiento_todos_servicios/cumplimiento_todos_servicios.module';
import { RequisitosCondicionesHabilitacionModule } from './resolucion/requisitos_condiciones_habilitacion/requisitos_condiciones_habilitacion.module';
import { ControlarImagenesModule } from './controlar_imagenes/controlar_imagenes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; // Importa join desde el módulo path
import { BackupBdModule } from './backup_bd/backup_bd.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '..', 'uploads'), // Asegúrate de que la ruta sea correcta
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>(DB_HOST),
        port: +configService.get<number>(DB_PORT),
        username: configService.get<string>(DB_USER),
        password: configService.get<string>(DB_PASSWORD),
        database: configService.get<string>(DB_DATABASE),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false
      
      }),
      inject: [ConfigService],
    }),
    UsuarioModule,
    RolModule,
    AuthModule,
    PrestadorModule,
    MunicipioModule,
    CriteriosicModule,
    ActividadModule,
    SpIndModule,
    ItemipsModule,
    EvaluacionipsModule,
    CriterioajusteModule,
    CriterioimpleModule,
    CriterioverifModule,
    PlaneacionModule,
    GenerarpdfModule,
    CalificacionpamecModule,
    CriteriosicCumplimientoModule,
    CriterioServiciosModule,
    CriteriosExtGeneralModule,
    CriteriosExtEspecializadaModule,
    CriteriosVacunacionModule,
    CriteriosSaludTrabajoModule,
    CriterioTerapiasModule,
    CriterioSFarmaceuticoModule,
    CriterioRadioOdontModule,
    CriterioImgRadIonizantesModule,
    CriterioImgRadNoionizantesModule,
    CriterioMedicinaNuclearModule,
    CriterioRadioterapiaModule,
    CriterioQuimioterapiaModule,
    CriterioDiagnostVascularModule,
    CriteriosHemodIntervenModule,
    CriteriosGestionPretransModule,
    CriteriosTomMuestrasModule,
    CriteriosLabClinicoModule,
    CriteriosMuesCuelloModule,
    CriteriosLabCitologiaModule,
    CriteriosLabHistotecnologiaModule,
    CriteriosPatologiaModule,
    CriteriosHospPacienteCronicoModule,
    CriteriosCuidBasicNeonatalModule,
    CriteriosCuidInterNeonatalModule,
    CriteriosCuidIntensNeonatalModule,
    CriteriosCuidInterPediatricoModule,
    CriteriosCuidIntensPediatricoModule,
    CriteriosCuidInterAdultoModule,
    CriteriosCuidIntensAdultoModule,
    CriteriosHospSaludMentalModule,
    CriteriosHospParcialModule,
    CriteriosConsPsicoactivasModule,
    CriteriosCirugiaModule,
    CriteriosUrgenciasModule,
    CriteriosTransAsistencialModule,
    CriteriosPrehospitalariaModule,
    CriteriosPartoModule,
    CriteriosDialisisModule,
    CriterioHospitalizacionModule,
    AuditoriaRegistroModule,
    CapacidadInstaladaModule,
    ServiciosVerificadosModule,
    GenerarExcelModule,
    EvaluacionSicModule,
    AuditoriaActualizacionModule,
    AuditoriaEliminacionModule,
    GrupoEvaluacionModule,
    ServicioModule,
    CumplimientosicModule,
    CalificacionipsAjusteModule,
    CalificacionipsImplementacionModule,
    CalificacionipsPlaneacionModule,
    CalificacionipsVerificacionModule,
    EvaluacionpamecModule,
    CumplimientoDiagVascularModule,
    CumplimientoDialisisModule,
    CumplimientoGestionPretransModule,
    CumplimientoHemodIntervenModule,
    CumplimientoImgRadIonizantesModule,
    CumplimientoImgRadNoionizantesModule,
    CumplimientoLabCitologiaModule,
    CumplimientoLabClinicoModule,
    CumplimientoLabHistotecnologiaModule,
    CumplimientoMedicinaNuclearModule,
    CumplimientoPatologiaModule,
    CumplimientoQuimioterapiaModule,
    CumplimientoServicioFarmaceuticoModule,
    CumplimientoTerapiasModule,
    CumplimientoMuesCuelloModule,
    CumplimientoTomMuestrasModule,
    CumplimientoPartoModule,
    CumplimientoPrehospitalariaModule,
    CumplimientoTransAsistencialModule,
    CumplimientoUrgenciasModule,
    CumplimientoExtEspecializadaModule,
    CumplimientoExtGeneralModule,
    CumplimientoSaludTrabajoModule,
    CumplimientoVacunacionModule,
    CumplimientoConsPsicoactivasModule,
    CumplimientoCuidBasicNeonatalModule,
    CumplimientoCuidIntensAdultoModule,
    CumplimientoCuidIntensNeonatalModule,
    CumplimientoCuidIntensPediatricoModule,
    CumplimientoCuidInterAdultoModule,
    CumplimientoCuidInterNeonatalModule,
    CumplimientoCuidInterPediatricoModule,
    CumplimientoHospitalizacionModule,
    CumplimientoHospPacienteCronicoModule,
    CumplimientoHospParcialModule,
    CumplimientoHospSaludMentalModule,
    CumplimientoCirugiaModule,
    CumplimientoTodosServiciosModule,
    RequisitosCondicionesHabilitacionModule,
    ControlarImagenesModule,
    BackupBdModule,
    


  ],
  controllers: [AppController, CriterioServiciosController, CriteriosExtGeneralController, CriteriosExtEspecializadaController, CriteriosVacunacionController, 
    CriteriosSaludTrabajoController, CriterioTerapiasController, CriterioSFarmaceuticoController, CriterioRadioOdontController, CriterioImgRadIonizantesController, 
    CriterioImgRadNoionizantesController, CriterioMedicinaNuclearController, CriterioRadioterapiaController, CriterioQuimioterapiaController, 
    CriterioDiagnostVascularController, CriteriosHemodIntervenController, CriteriosGestionPretransController, 
    CriteriosTomMuestrasController, CriteriosLabClinicoController, CriteriosMuesCuelloController, CriteriosLabCitologiaController, 
    CriteriosLabHistotecnologiaController, CriteriosPatologiaController, CriteriosDialisisController, 
    CriteriosHospPacienteCronicoController, CriteriosCuidBasicNeonatalController, CriteriosCuidInterNeonatalController, CriteriosCuidIntensNeonatalController, 
    CriteriosCuidInterPediatricoController, CriteriosCuidIntensPediatricoController, CriteriosCuidInterAdultoController, CriteriosCuidIntensAdultoController, 
    CriteriosHospSaludMentalController, CriteriosHospParcialController, CriteriosConsPsicoactivasController, CriteriosCirugiaController, CriteriosUrgenciasController, 
    CriteriosTransAsistencialController, CriteriosPrehospitalariaController, CriteriosPartoController, CapacidadInstaladaController, AuditoriaRegistroController],
  providers: [AppService],
})
export class AppModule {}
