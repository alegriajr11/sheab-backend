/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Criterio_servicios } from "./criterio_servicios.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";
// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_servicios' })
export class CumplimientoServiciosEntity {
    @PrimaryGeneratedColumn('increment')
    cumps_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cumps_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: true, unique: false })
    cumps_hallazgo: string;


    @ManyToOne(() => Criterio_servicios)
    @JoinColumn()
    criterio_servicios: Criterio_servicios

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-TODOS-SERVICIOS
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_servicios => eva_servicios.eva_todos_servi_cumplimiento)
    cump_eva_todos_servi: EvaluacionResVerificacionEntity
}
