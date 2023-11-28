/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "../prestador.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'clasificacion'})
export class ClasificacionEntity {
    @PrimaryGeneratedColumn('increment')
    cla_id: number;

    @Column({type: 'varchar', length: 70, nullable: false, unique: false})
    cla_nombre: string;

    //Relacion Uno a Muchos CLASIFICACION - PRESTADOR
    @OneToMany(type => PrestadorEntity, prestador => prestador.pre_clasificacion)
    cla_prestador: PrestadorEntity;
}