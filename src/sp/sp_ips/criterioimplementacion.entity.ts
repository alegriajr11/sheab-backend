/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EvaluacionipsEntity } from "./evaluacionips.entity";
import { CalificacionImplementacionIpsEntity } from "./calificacionips_implementacion.entity";

@Entity({name: 'criterio_implementacion'})
export class CriterioImplementacionEntity {
    @PrimaryGeneratedColumn('increment')
    cri_imp_id: number;

    @Column({type: 'varchar', length: 500, nullable: false, unique: false})
    cri_imp_nombre: string;

    @Column({type: 'varchar', length: 200, nullable: false, unique: false})
    cri_imp_verificacion
    
    //Relacion Muchos a Uno CRITERIO_IMPLEMENTACION - EVALUACIONIPS
    @ManyToOne(type => EvaluacionipsEntity, criterio_implementacion => criterio_implementacion.evaluacionipsImpl)  
    cri_imp_eva: EvaluacionipsEntity

    //Relacion Uno a Muchos CRITERIO_IMPLEMENTACION - CALIFICACION_IMPLEMENTACIONIPS
    @OneToMany(type => CalificacionImplementacionIpsEntity, criterio_implementacion => criterio_implementacion.calificacionipsImpl)
    criterio_implementacion_cal: CalificacionImplementacionIpsEntity

}