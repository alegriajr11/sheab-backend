/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EvaluacionipsEntity } from "./evaluacionips.entity";
import { CalificacionPlaneacionIpsEntity } from "./calificacionips_planeacion.entity";

@Entity({ name: 'criterio_planeacion' })
export class CriterioPlaneacionEntity {
    @PrimaryGeneratedColumn('increment')
    cri_pla_id: number;

    @Column({ type: 'varchar', length: 620, nullable: false, unique: false })
    cri_pla_nombre: string;

    @Column({ type: 'varchar', length: 300, nullable: false, unique: false })
    cri_pla_verificacion

    //Relacion Muchos a Uno CRITERIO_PLANEACION - EVALUACIONIPS
    @ManyToOne(type => EvaluacionipsEntity, criterio_planeacion => criterio_planeacion.evaluacionipsPlane)
    cri_pla_eva: EvaluacionipsEntity


    //Relacion Uno a Muchos CRITERIO_PLANEACION - CALIFICACION_IPS
    @OneToMany(type => CalificacionPlaneacionIpsEntity, criterio_planeacion => criterio_planeacion.calificacionipsPlaneacion)
    criterio_planeacion_cal: CalificacionPlaneacionIpsEntity
}