/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioHospitalizacionEntity } from "./criterio_hospitalizacion.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";




// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_hospitalizacion' })
export class CumplimientoHospitalizacionEntity {
    @PrimaryGeneratedColumn('increment')
    cump_hosp_id: number;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cump_hosp_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: true, unique: false })
    cump_hosp_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: true, unique: false })
    cump_hosp_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: true, unique: false })
    cump_hosp_responsable: string;

    @Column({ type: 'date', nullable: false, unique: true })
    cump_hosp_fecha_limite: string;


    @OneToOne(() => CriterioHospitalizacionEntity)
    @JoinColumn()
    criterio_hospitalizacion: CriterioHospitalizacionEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_hospi_cumplimiento)
    cump_eva_hospi: EvaluacionResVerificacionEntity
}