/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EvaluacionipsEntity } from "./evaluacionips.entity";
import { CriterioAjusteEntity } from "./criterioajuste.entity";
import { CriterioImplementacionEntity } from "./criterioimplementacion.entity";
import { CriterioVerificacionEntity } from "./criterioverificacion.entity";
import { CriterioPlaneacionEntity } from "./criterioplaneacion.entity";



@Entity({name: 'calificacion_ips_ajuste'})
export class CalificacionAjusteIpsEntity {
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

    
    //Relacion Muchos a Uno CALIFICACION_IPS - CRITERIO_AJUSTE
    @ManyToOne(type => CriterioAjusteEntity, calificacion_ips => calificacion_ips.criterio_ajuste)
    calificacionipsAjuste: CriterioAjusteEntity

}