/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioCuelloUterinoEntity } from "./criterio_tom_muest_cuello.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_cuello_uterino' })
export class CumplimientoCuelloUterinoEntity {
    @PrimaryGeneratedColumn('increment')
    cump_cue_uter_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_cue_uter_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_cue_uter_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_cue_uter_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_cue_uter_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_cue_uter_fecha_limite: string;



    @OneToOne(() => CriterioCuelloUterinoEntity)
    @JoinColumn()
    criterio_cuello_uterino: CriterioCuelloUterinoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_cuello_uterino)
    cump_eva_cuello_uterino: EvaluacionResVerificacionEntity
}