/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "../prestador.entity";

@Entity({name: 'clase'})
export class ClaseEntity {
    @PrimaryGeneratedColumn('increment')
    clas_id: number;

    @Column({type: 'varchar', length: 10, nullable: false, unique: false})
    clas_nombre: string;

    //Relacion Uno a Muchos CLASE - PRESTADOR
    @OneToMany(type => PrestadorEntity, prestador => prestador.pre_clase)
    clas_prestador: PrestadorEntity;
}