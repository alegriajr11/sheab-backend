/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioImgRadNoIonizantesEntity } from "./criterio_img_rad_noionizantes.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_img_noionizante' })
export class CumplimientoImgRadNoIonizanteEntity {
    @PrimaryGeneratedColumn('increment')
    cump_img_noion_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_img_noion_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_img_noion_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_img_noion_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_img_noion_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_img_noion_fecha_limite: string;


    @OneToOne(() => CriterioImgRadNoIonizantesEntity)
    @JoinColumn()
    criterio_img_rad_noion: CriterioImgRadNoIonizantesEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_ima_noioniza)
    cump_eva_ima_noioniza: EvaluacionResVerificacionEntity
}