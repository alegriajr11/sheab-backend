/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioTerapiaEntity } from "./criterios_terapias.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";


// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_terapia' })
export class CumplimientoTerapiaEntity {
    @PrimaryGeneratedColumn('increment')
    cump_ter_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_ter_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_ter_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_ter_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_ter_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_ter_fecha_limite: string;


    @OneToOne(() => CriterioTerapiaEntity)
    @JoinColumn()
    criterio_terapia: CriterioTerapiaEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_terapia)
    cump_eva_terapia: EvaluacionResVerificacionEntity
}