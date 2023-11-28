/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioLabClinicoEntity } from "./criterio_lab_clinico.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";


// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_lab_clinico' })
export class CumplimientoLabClinicoEntity {
    @PrimaryGeneratedColumn('increment')
    cump_labclin_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_labclin_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_labclin_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_labclin_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_labclin_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_labclin_fecha_limite: string;


    @OneToOne(() => CriterioLabClinicoEntity)
    @JoinColumn()
    criterio_lab_clinico: CriterioLabClinicoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_lab_clinico)
    cump_eva_lab_clinico: EvaluacionResVerificacionEntity

}