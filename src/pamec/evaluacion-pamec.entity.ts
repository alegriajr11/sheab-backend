/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ActividadEntity } from "./actividad.entity";
import { ActaPamecEntity } from "src/generarpdf/pamec/pamec-acta/pamec-acta.entity";
import { CalificacionpamEntity } from "./calificacionpam.entity";


@Entity({ name: 'evaluacion-pamec' })
export class EvaluacionPamecEntity {
    @PrimaryGeneratedColumn('increment')
    eva_id: number;

    @Column({ type: 'date', nullable: false })
    eva_creado: Date;


    //Relacion Muchos a Uno EVALUACION-PAMEC - PRESTADOR
    @ManyToOne(type => PrestadorEntity, prestadorPam => prestadorPam.prestador_eval_pamec)
    eval_prestador: PrestadorEntity;


    //Relacion Muchos a CALIFICACIONES - EVALUACION-PAMEC
    @OneToMany(type => CalificacionpamEntity, calificacionPamec => calificacionPamec.cal_evaluacion_pam)
    eval_calpam: CalificacionpamEntity

    //Relacion UNO a UNO EVALUACION PAMEC - ACTAS PAMEC
    @OneToOne(() => ActaPamecEntity, actaPamec => actaPamec.act_eval_pamec)
    @JoinColumn()
    eval_acta_pamec: ActaPamecEntity;
}