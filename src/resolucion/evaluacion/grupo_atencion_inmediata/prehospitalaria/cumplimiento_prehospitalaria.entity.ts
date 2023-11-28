/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioPrehospitalariaEntity } from "./criterio_prehospitalaria.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_prehospitalaria' })
export class CumplimientoPrehospitalariaEntity {
    @PrimaryGeneratedColumn('increment')
    cump_preh_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_preh_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_preh_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_preh_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_preh_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_preh_fecha_limite: string;



    @OneToOne(() => CriterioPrehospitalariaEntity)
    @JoinColumn()
    criterio_prehospitalaria: CriterioPrehospitalariaEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_prehospi)
    cump_eva_prehospi: EvaluacionResVerificacionEntity

}