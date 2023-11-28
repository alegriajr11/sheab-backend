/* eslint-disable prettier/prettier */
import { Column, Entity,  ManyToOne,  PrimaryGeneratedColumn } from "typeorm";
import { CriterioRadiologiaOdontoEntity } from "./criterio_radio_odont.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_rad_odontologica' })
export class CumplimientoRadOdontologicaEntity {
    @PrimaryGeneratedColumn('increment')
    cump_rad_odont_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_rad_odont_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_rad_odont_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_rad_odont_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_rad_odont_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_rad_odont_fecha_limite: string;


    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => CriterioRadiologiaOdontoEntity, criterio => criterio.cumplimiento)
    criterio_rad_odontologica: CriterioRadiologiaOdontoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_radio_odont)
    cump_eva_radio_odont: EvaluacionResVerificacionEntity

}