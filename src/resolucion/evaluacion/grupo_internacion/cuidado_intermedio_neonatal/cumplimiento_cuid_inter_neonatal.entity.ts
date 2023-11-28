/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioCuidIntermNeonatalEntity } from "./criterio_cuid_inter_neonatal.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_cui_inter_neonatal' })
export class CumplimientoCuidInterNeonatalEntity {
    @PrimaryGeneratedColumn('increment')
    cump_inter_neona_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_inter_neona_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_inter_neona_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_inter_neona_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_inter_neona_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_inter_neona_fecha_limite: string;



    @OneToOne(() => CriterioCuidIntermNeonatalEntity)
    @JoinColumn()
    criterio_cuid_inter_neona: CriterioCuidIntermNeonatalEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_inter_neo_cumplimiento)
    cump_eva_inter_neo: EvaluacionResVerificacionEntity

}