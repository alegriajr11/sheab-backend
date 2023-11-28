/* eslint-disable prettier/prettier */
import { Column, Entity,  ManyToOne,  PrimaryGeneratedColumn } from "typeorm";
import { CriterioDiagnostVascularEntity } from "./criterio_diagnost_vascular.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";


@Entity({ name: 'cumplimiento_diagnostico_vascular' })
export class CumplimientoDiagnosticoVascularEntity {
    @PrimaryGeneratedColumn('increment')
    cump_diagv_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_diagv_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_diagv_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_diagv_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_diagv_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_diagv_fecha_limite: string;



    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => CriterioDiagnostVascularEntity, criterio => criterio.cumplimiento)
    criterio_diag_vascular: CriterioDiagnostVascularEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_espec_cumplimiento)
    cump_eva_diag_vas: EvaluacionResVerificacionEntity
}