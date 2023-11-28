/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { SedeEntity } from "src/prestador/sede/sede.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'municipio' })
export class MunicipioEntity {
    @PrimaryGeneratedColumn('increment')
    mun_id: number;

    @Column({ type: 'varchar', length: 70, nullable: false, unique: false })
    mun_nombre: string;

    //Relacion Uno a Muchos MUNICIPIO - PRESTADOR
    @OneToMany(type => PrestadorEntity, prestador => prestador.pre_municipio)
    mun_prestador: PrestadorEntity;


}