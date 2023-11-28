/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EtapaInd } from "./etapaind.entity";
import { ActaSpIndependientePdfEntity } from "src/generarpdf/sp/sp-independientes/sp-ind-acta.entity";
import { CalificacionIndEntity } from "./calificacionind.entity";



@Entity({ name: 'evaluacion-sp-independientes' })
export class EvaluacionIndependientesEntity {
    @PrimaryGeneratedColumn('increment')
    eva_id: number;

    @Column({ type: 'date', nullable: false })
    eva_creado: Date;


    //Relacion Muchos a Uno EVALUACION-INDEPENDIENTES - PRESTADOR
    @ManyToOne(type => PrestadorEntity, prestadorIndependientes => prestadorIndependientes.prestador_eval_independientes)
    eval_prestador: PrestadorEntity;

    //Relacion Uno a Muchos EVALUACION-INDEPENDIENTES - CALIFICACION-INDEPENDEINTE
    @OneToMany(type => CalificacionIndEntity, evaluacionips => evaluacionips.cal_evaluacion_independientes)
    eval_cal_independientes: CalificacionIndEntity

    @OneToOne(() => ActaSpIndependientePdfEntity, actaIndependientes => actaIndependientes.act_eval_ind)
    @JoinColumn()
    eval_acta_ind: ActaSpIndependientePdfEntity;
}