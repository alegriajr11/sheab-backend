/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioVacunacionEntity } from "./criterio_vacunacion.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_vacunacion' })
export class CumplimientoVacunacionEntity {
    @PrimaryGeneratedColumn('increment')
    cump_vac_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_vac_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_vac_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_vac_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_vac_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_vac_fecha_limite: string;



    @OneToOne(() => CriterioVacunacionEntity)
    @JoinColumn()
    criterio_vacunacion: CriterioVacunacionEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_vacu_cumplimiento)
    cump_eva_vacu: EvaluacionResVerificacionEntity

}