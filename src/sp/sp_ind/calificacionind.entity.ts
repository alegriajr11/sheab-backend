/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioIndEntity } from "./criterioind.entity";
import { EvaluacionIndependientesEntity } from "./evaluacion-independientes.entity";


@Entity({ name: 'calificacion_ind' })
export class CalificacionIndEntity {
    @PrimaryGeneratedColumn('increment')
    cal_id: number;

    @Column({ type: 'int' })
    cal_nota: number;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: false })
    cal_observaciones: string;

    @Column({ type: 'varchar', length: 10, nullable: false, default: true })
    cal_asignado: string;


    //Relacion Muchos a Uno  CALIFICACIONES  A CRITERIO
    @ManyToOne(type => CriterioIndEntity, criterio => criterio.calificaciones_cri)
    criterio_cal: CriterioIndEntity

    //Relacion Muchos a CALIFICACIONES - EVALUACIONINDEPENDIENTES
    @ManyToOne(type => EvaluacionIndependientesEntity, evaluacionIndependientes => evaluacionIndependientes.eval_cal_independientes)
    cal_evaluacion_independientes: EvaluacionIndependientesEntity
}