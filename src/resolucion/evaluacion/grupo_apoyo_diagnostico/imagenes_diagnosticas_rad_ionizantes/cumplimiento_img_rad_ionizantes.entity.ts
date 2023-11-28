/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioImgRadIonizantesEntity } from "./criterio_img_rad_ionizantes.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_img_ionizante' })
export class CumplimientoImgRadIonizanteEntity {
    @PrimaryGeneratedColumn('increment')
    cump_imgion_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_imgion_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_imgion_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_imgion_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_imgion_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_imgion_fecha_limite: string;
    

    @OneToOne(() => CriterioImgRadIonizantesEntity)
    @JoinColumn()
    criterio_img_rad_ion: CriterioImgRadIonizantesEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_ima_ioniza)
    cump_eva_ima_ioniza: EvaluacionResVerificacionEntity

}