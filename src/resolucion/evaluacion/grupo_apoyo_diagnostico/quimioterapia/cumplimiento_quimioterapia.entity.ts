/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioQuimioterapiaEntity } from "./criterio_quimioterapia.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_quimioterapia' })
export class CumplimientoQuimioterapiaEntity {
    @PrimaryGeneratedColumn('increment')
    cump_quim_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_quim_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_quim_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_quim_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_quim_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_quim_fecha_limite: string;



    @OneToOne(() => CriterioQuimioterapiaEntity)
    @JoinColumn()
    criterio_quimioterapia: CriterioQuimioterapiaEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_quimio)
    cump_eva_quimio: EvaluacionResVerificacionEntity

}