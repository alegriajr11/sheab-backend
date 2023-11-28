/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CriteriosicEntity } from "./criteriosic.entity";
import { CumplimientoSicEntity } from "./cumplimientosic.entity";
import { DominioEntity } from "./dominio.entity";

@Entity({name: 'indicador'})
export class IndicadorEntity {

    @PrimaryColumn({type: 'varchar', length: 7, nullable: false, unique: false})
    ind_id: string

    @Column({type: 'varchar', length: 255, nullable: false, unique: false})
    ind_nombre: string;
    
    //Relacion MUCHOS a UNO INDICADOR - DOMINIO
    @ManyToOne(type => DominioEntity, dominio => dominio.dom_indicador)
    ind_dominio: DominioEntity;

    //Relacion UNO a MUCHOS INDICADOR SIC - CUMPLIMIENTOSIC
    @OneToMany(type => CumplimientoSicEntity, cumplimiento => cumplimiento.indicadorsic)
    cumplimiento_sic: CumplimientoSicEntity;
}