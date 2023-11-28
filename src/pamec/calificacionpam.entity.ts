/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CriteriopamEntity } from "./criteriopam.entity";
import { EvaluacionPamecEntity } from "./evaluacion-pamec.entity";


@Entity({ name: 'calificacionpam' })
export class CalificacionpamEntity {
    forEach(arg0: (cal: any) => void) {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn('increment')
    cal_id: number;

    @Column({})
    cal_nota: number;

    @Column({ type: 'varchar', length: 11, nullable: false, unique: false })
    cal_aplica: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
    cal_observaciones: string;

    @Column({ type: 'varchar', length: 10, nullable: false, default: true })
    cal_asignado: string;


    @ManyToOne(type => CriteriopamEntity, calificacion_pam => calificacion_pam.criterio_calificacionpam)
    criteriopam_calificacion: CriteriopamEntity;

    //Relacion Muchos a CALIFICACIONES - EVALUACION-PAMEC
    @ManyToOne(type => EvaluacionPamecEntity, evaluacionPamec => evaluacionPamec.eval_calpam)
    cal_evaluacion_pam: EvaluacionPamecEntity
}