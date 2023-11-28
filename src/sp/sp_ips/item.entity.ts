/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EvaluacionipsEntity } from "./evaluacionips.entity";

@Entity({name: 'item'})
export class ItemEntity {
    @PrimaryGeneratedColumn('increment')
    ite_id: number;

    @Column({type: 'varchar', length: 20, nullable: false, unique: false})
    ite_nombre: string;
    
    //Relacion Muchos a Muchos ITEM - EVALUACIONIPS
    @ManyToMany(type => EvaluacionipsEntity, evaluacionips => evaluacionips.evips_items)  
    ite_evaluacionips: EvaluacionipsEntity

}