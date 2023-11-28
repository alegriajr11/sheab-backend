/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CriterioAjusteEntity } from "./criterioajuste.entity";
import { CriterioPlaneacionEntity } from "./criterioplaneacion.entity";



@Entity({name: 'calificacion_ips_planeacion'})
export class CalificacionPlaneacionIpsEntity {
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

    
    //Relacion Muchos a Uno CALIFICACION_IPS - CRITERIO_PLANEACION
    @ManyToOne(type => CriterioPlaneacionEntity, calificacion_ips_planeacion => calificacion_ips_planeacion.criterio_planeacion_cal)
    calificacionipsPlaneacion: CriterioPlaneacionEntity

}