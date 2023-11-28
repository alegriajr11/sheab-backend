/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioMuestraLabClinicoEntity } from "./criterio_tom_muestras.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_muestra_lab_clinico' })
export class CumplimientoMuestLabClinicoEntity {
    @PrimaryGeneratedColumn('increment')
    cump_mues_clin_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_mues_clin_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_mues_clin_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_mues_clin_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_mues_clin_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_mues_clin_fecha_limite: string;
    

    @OneToOne(() => CriterioMuestraLabClinicoEntity)
    @JoinColumn()
    criterio_muest_lab_clinico: CriterioMuestraLabClinicoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_toma_muestras_lab_cli)
    cump_eva_toma_muestras_lab_cli: EvaluacionResVerificacionEntity

}