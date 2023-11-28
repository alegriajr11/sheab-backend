/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioCuidIntermAdultoEntity } from "./criterio_cuid_inter_adulto.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_cui_inter_adulto' })
export class CumplimientoCuidInterAdultoEntity {
    @PrimaryGeneratedColumn('increment')
    cump_inter_adulto_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_inter_adulto_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_inter_adulto_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_inter_adulto_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_inter_adulto_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_inter_adulto_fecha_limite: string;

    

    @OneToOne(() => CriterioCuidIntermAdultoEntity)
    @JoinColumn()
    criterio_cuid_inter_adult: CriterioCuidIntermAdultoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_inter_adul_cumplimiento)
    cump_eva_inter_adul: EvaluacionResVerificacionEntity
}