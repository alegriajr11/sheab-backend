/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CriterioVerificacionEntity } from "./criterioverificacion.entity";



@Entity({name: 'calificacion_ips_verificacion'})
export class CalificacionVerificacionIpsEntity {
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
    
    //Relacion Muchos a Uno CALIFICACION_IPS_VERIFICACION - CRITERIO_VERIFICACION
    @ManyToOne(type => CriterioVerificacionEntity, calificacion_verificacion_ips => calificacion_verificacion_ips.criterio_verificacion_cal)
    calificacionipsVerif: CriterioVerificacionEntity

}