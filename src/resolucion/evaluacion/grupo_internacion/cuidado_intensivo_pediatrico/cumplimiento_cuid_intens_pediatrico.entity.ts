/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioCuidIntePediatricoEntity } from "./criterio_cuid_intens_pediatrico.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_cui_int_pediatrico' })
export class CumplimientoCuidIntPediatricoEntity {
    @PrimaryGeneratedColumn('increment')
    cump_int_ped_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_int_ped_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_int_ped_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_int_ped_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_int_ped_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_int_ped_fecha_limite: string;



    @OneToOne(() => CriterioCuidIntePediatricoEntity)
    @JoinColumn()
    criterio_cuid_int_pediatrico: CriterioCuidIntePediatricoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_intens_pedia_cumplimiento)
    cump_eva_intens_pedia: EvaluacionResVerificacionEntity

}