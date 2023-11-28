/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioCuidIntensAdultoEntity } from "./criterio_cuid_intens_adulto.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_cui_int_adulto' })
export class CumplimientoIntAdultoEntity {
    @PrimaryGeneratedColumn('increment')
    cump_cui_int_adul_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_cui_int_adul_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_cui_int_adul_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_cui_int_adul_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_cui_int_adul_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_cui_int_adul_fecha_limite: string;

    

    @OneToOne(() => CriterioCuidIntensAdultoEntity)
    @JoinColumn()
    criterio_cuid_int_adulto: CriterioCuidIntensAdultoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_intens_adul_cumplimiento)
    cump_eva_intens_adul: EvaluacionResVerificacionEntity

}