/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CumplimientoSicEntity } from "./cumplimientosic.entity";
import { IndicadorEntity } from "./indicador.entity";

@Entity({ name: 'criteriosic' })
export class CriteriosicEntity {
    @PrimaryGeneratedColumn('increment')
    cri_id: number;

    @Column({ type: 'varchar', length: 120, nullable: false, unique: false })
    cri_nombre: string;


    //Relacion UNO a MUCHOS CRITERIOS SIC - CUMPLIMIENTOSIC
    @OneToMany(type => CumplimientoSicEntity, cumplimiento => cumplimiento.criterio_sic)
    cumplimiento_sic: CumplimientoSicEntity;
}