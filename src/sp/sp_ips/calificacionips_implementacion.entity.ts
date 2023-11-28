/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CriterioImplementacionEntity } from "./criterioimplementacion.entity";



@Entity({name: 'calificacion_ips_implementacion'})
export class CalificacionImplementacionIpsEntity {
    @PrimaryGeneratedColumn('increment')
    cal_id: number;

    @Column({type: 'int'})
    cal_nota: number;

    @Column({type: 'varchar', length: 255, nullable: true, unique: false})
    cal_observaciones: string;

    @Column({type: 'int'})
    eva_ips_id: number;

    @Column({type: 'int'})
    acta_ips: number;
    
    //Relacion Muchos a Uno CALIFICACION_IPS - CRITERIO_IMPLEMENTACION
    @ManyToOne(type => CriterioImplementacionEntity, calificacion_implement_ips => calificacion_implement_ips.criterio_implementacion_cal)
    calificacionipsImpl: CriterioImplementacionEntity

}