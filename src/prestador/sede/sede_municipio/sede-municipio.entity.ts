/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { SedeEntity } from "src/prestador/sede/sede.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'sede_municipio' })
export class SedeMunicipioEntity {
    @PrimaryGeneratedColumn('increment')
    sede_mun_id: number;

    @Column({ type: 'varchar', length: 70, nullable: false, unique: false })
    sede_mun_nombre: string;

    //Relacion Uno a Muchos MUNICIPIO - SEDE
    @OneToMany(type => SedeEntity, sede => sede.sede_municipio)
    mun_sede_prestador: SedeEntity;

}