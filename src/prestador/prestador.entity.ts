/* eslint-disable prettier/prettier */
import { ClasificacionEntity } from "./clasificacion/clasificacion.entity";
import { ClaseEntity } from "./clase/clase.entity";
import { TipoEntity } from "./tipo/tipo.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { MunicipioEntity } from "src/municipio/municipio.entity";
import { CapacidadInstaladaEntity } from "src/resolucion/servicios_capacidad/capacidad_instalada.entity";
import { EvaluacionPamecEntity } from "src/pamec/evaluacion-pamec.entity";
import { EvaluacionIndependientesEntity } from "src/sp/sp_ind/evaluacion-independientes.entity";
import { EvaluacionSicEntity } from "src/sic/evaluacionsic.entity";
import { SedeEntity } from "./sede/sede.entity";
import { EvaluacionipsCreadasEntity } from "src/sp/sp_ips/evaluacion_ips_creada.entity";
import { ServiciosVerificadosEntity } from "src/resolucion/servicios_capacidad/servicios_verificados.entity";
import { EvaluacionResVerificacionEntity } from "src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity";



@Entity({ name: 'prestador' })
export class PrestadorEntity {

    @PrimaryColumn({ type: 'varchar', length: 15, nullable: false, unique: false })
    pre_cod_habilitacion: string

    @Column({ type: 'varchar', length: 100, nullable: false })
    pre_nombre: string;

    @Column({ type: 'varchar', length: 11, nullable: false })
    pre_nit: string;

    @Column({ type: 'varchar', length: 90, nullable: false })
    pre_direccion: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    pre_telefono: string;

    @Column({ type: 'varchar', length: 120, nullable: false })
    pre_email: string;

    @Column({ type: 'varchar', length: 3, nullable: false })
    pre_habilitado: string;

    @Column({ type: 'varchar', length: 60, nullable: true })
    pre_representante: string;


    //Relacion MUCHOS a UNO
    @ManyToOne(type => ClasificacionEntity, clasificacion => clasificacion.cla_prestador)
    pre_clasificacion: ClasificacionEntity;

    @ManyToOne(type => ClaseEntity, clase => clase.clas_prestador)
    pre_clase: ClaseEntity;

    @ManyToOne(type => TipoEntity, tipo => tipo.tip_prestador)
    pre_tipo: TipoEntity;

    //Relacion UNO a MUCHOS PRESTADOR - SEDE
    @OneToMany(type => SedeEntity, sede => sede.sede_prestador)
    pre_sede: SedeEntity

    @ManyToOne(type => MunicipioEntity, municipio => municipio.mun_prestador)
    pre_municipio: MunicipioEntity

    //Relacion Uno a Muchos PRESTADORES - EVALUACION-PAMEC
    @OneToMany(type => EvaluacionPamecEntity, evaluacionPamec => evaluacionPamec.eval_prestador)
    prestador_eval_pamec: EvaluacionPamecEntity

    //Relacion Uno a Muchos PRESTADORES - EVALUACION-INDEPENDIENTES
    @OneToMany(type => EvaluacionIndependientesEntity, evaluacionIndependientes => evaluacionIndependientes.eval_prestador)
    prestador_eval_independientes: EvaluacionIndependientesEntity

    //Relacion Uno a Muchos PRESTADORES - EVALUACION - SP IPS
    @OneToMany(type => EvaluacionipsCreadasEntity, evaluacionIps => evaluacionIps.eval_ips_prestator)
    prestator_eval_ips: EvaluacionipsCreadasEntity;

    //Relacion Uno a Muchos PRESTADORES - EVALUACION-SIC
    @OneToMany(type => EvaluacionSicEntity, evaluacionSic => evaluacionSic.eval_sic_prestator)
    prestator_eval_sic: EvaluacionSicEntity;


    //Relacion Uno a Muchos PRESTADORES - CAPACIDAD INSTALADA
    @OneToMany(type => CapacidadInstaladaEntity, capacidad_instalada => capacidad_instalada.prestadores)
    capacidad_instalada: CapacidadInstaladaEntity

    //Relacion Uno a Muchos PRESTADORES - SERVICIOS VERIFICADOS
    @OneToMany(type => ServiciosVerificadosEntity, servicios_verf => servicios_verf.prestadores)
    servicios_verificados: ServiciosVerificadosEntity

    //Relacion Uno a Muchos PRESTADORES - EVALUACION-RESOLUCION-VERIFICACION
    @OneToMany(type => EvaluacionResVerificacionEntity, evaluacionVerificacion => evaluacionVerificacion.eval_verificacion_prestador)
    eval_prestador_verificacion: EvaluacionResVerificacionEntity
    
}