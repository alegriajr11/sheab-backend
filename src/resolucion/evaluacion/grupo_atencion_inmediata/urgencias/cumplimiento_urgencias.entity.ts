/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioUrgenciasEntity } from "./criterio_urgencias.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_urgencias' })
export class CumplimientoUrgenciasEntity {
    @PrimaryGeneratedColumn('increment')
    cump_urge_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_urge_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_urge_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_urge_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_urge_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_urge_fecha_limite: string;


    @OneToOne(() => CriterioUrgenciasEntity)
    @JoinColumn()
    criterio_urgencias: CriterioUrgenciasEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_urgencias)
    cump_eva_urgencias: EvaluacionResVerificacionEntity

}