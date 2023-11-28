/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioConsumoPsicoactivasEntity } from "./criterio_cuid_cons_psicoact.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_cons_psicoactivas' })
export class CumplimientoConsPsicoactivasEntity {
    @PrimaryGeneratedColumn('increment')
    cump_cons_psic_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_cons_psic_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_cons_psic_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_cons_psic_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_cons_psic_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_cons_psic_fecha_limite: string;


    @OneToOne(() => CriterioConsumoPsicoactivasEntity)
    @JoinColumn()
    criterio_cons_psico: CriterioConsumoPsicoactivasEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cons_psico_cumplimiento)
    cump_eva_cons_psico: EvaluacionResVerificacionEntity


}