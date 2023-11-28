/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioHospitalizacionMentalEntity } from "./criterio_hosp_salud_mental.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_hospitalizacion_mental' })
export class CumplimientoHospitalizacionMentalEntity {
    @PrimaryGeneratedColumn('increment')
    cump_hosp_ment_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_hosp_ment_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_hosp_ment_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_hosp_ment_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_hosp_ment_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_hosp_ment_fecha_limite: string;


    @OneToOne(() => CriterioHospitalizacionMentalEntity)
    @JoinColumn()
    criterio_hospitalizacion_mental: CriterioHospitalizacionMentalEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_hospi_mental_cumplimiento)
    cump_eva_hospi_mental: EvaluacionResVerificacionEntity

}