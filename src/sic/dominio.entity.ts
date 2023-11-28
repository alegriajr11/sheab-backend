/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IndicadorEntity } from "./indicador.entity";
import { EvaluacionSicEntity } from "./evaluacionsic.entity";

@Entity({ name: 'dominio' })
export class DominioEntity {
    @PrimaryGeneratedColumn('increment')
    dom_id: number;

    @Column({ type: 'varchar', length: 70, nullable: false, unique: false })
    dom_nombre: string;

    //Relacion Uno a Muchos DOMINIO - INDICADOR
    @OneToMany(type => IndicadorEntity, indicador => indicador.ind_dominio)
    dom_indicador: IndicadorEntity;

    
   


}