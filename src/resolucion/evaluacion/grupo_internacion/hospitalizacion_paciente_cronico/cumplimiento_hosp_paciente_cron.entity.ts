/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioHospitCronicoEntity } from "./criterio_hosp_paciente_cron.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_hospitalizacion_cronico' })
export class CumplimientoHospitCronicoEntity {
    @PrimaryGeneratedColumn('increment')
    cump_hosp_cron_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_hosp_cron_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_hosp_cron_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_hosp_cron_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_hosp_cron_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_hosp_cron_fecha_limite: string;

    

    @OneToOne(() => CriterioHospitCronicoEntity)
    @JoinColumn()
    criterio_hospit_cronico: CriterioHospitCronicoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, evares => evares.eva_hospi_cronico_cumplimiento)
    cump_eva_hospi_cronico: EvaluacionResVerificacionEntity

}