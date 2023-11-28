/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "../prestador.entity";

@Entity({name: 'tipo'})
export class TipoEntity {
    @PrimaryGeneratedColumn('increment')
    tip_id: number;

    @Column({type: 'varchar', length: 10, nullable: false, unique: false})
    tip_nombre: string;

    //Relacion Uno a Muchos TIPO - PRESTADOR
    @OneToMany(type => PrestadorEntity, prestador => prestador.pre_tipo)
    tip_prestador: PrestadorEntity;
}