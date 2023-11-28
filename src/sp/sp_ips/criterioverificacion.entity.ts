/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EvaluacionipsEntity } from "./evaluacionips.entity";
import { CalificacionVerificacionIpsEntity } from "./calificacionips_verificacion.entity";

@Entity({ name: 'criterio_verificacion' })
export class CriterioVerificacionEntity {
    @PrimaryGeneratedColumn('increment')
    cri_ver_id: number;

    @Column({ type: 'varchar', length: 530, nullable: false, unique: false })
    cri_ver_nombre: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cri_ver_verificacion

    //Relacion Muchos a Uno CRITERIO_VERIFICACION - EVALUACIONIPS
    @ManyToOne(type => EvaluacionipsEntity, criterio_verificacion => criterio_verificacion.evaluacionipsVerif)
    cri_ver_eva: EvaluacionipsEntity

    //Relacion Uno a Muchos CRITERIO_VERIFICACION - CALIFICACION_IPS_VERIFICACION
    @OneToMany(type => CalificacionVerificacionIpsEntity, criterio_verificacion => criterio_verificacion.calificacionipsVerif)
    criterio_verificacion_cal: CalificacionVerificacionIpsEntity
}