/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioPatologiaEntity } from "./criterio_patologia.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_patologia' })
export class CumplimientoPatologiaEntity {
    @PrimaryGeneratedColumn('increment')
    cump_pato_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_pato_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_pato_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_pato_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_pato_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_pato_fecha_limite: string;

    @OneToOne(() => CriterioPatologiaEntity)
    @JoinColumn()
    criterio_patologia: CriterioPatologiaEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_patologia)
    cump_eva_patologia: EvaluacionResVerificacionEntity
}