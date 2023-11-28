/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioDialisisEntity } from "./criterio_dialisis.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";


// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_dialisis' })
export class CumplimientoDialisisEntity {
    @PrimaryGeneratedColumn('increment')
    cump_dial_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_dial_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_dial_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_dial_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_dial_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_dial_fecha_limite: string;
    

    @OneToOne(() => CriterioDialisisEntity)
    @JoinColumn()
    criterio_dialisis: CriterioDialisisEntity

    
    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_dial)
    cump_eva_dial: EvaluacionResVerificacionEntity

}