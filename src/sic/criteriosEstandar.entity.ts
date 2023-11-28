/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'criterio_estandarsic' })
export class CriterioEstandarSicEntity {
    @PrimaryGeneratedColumn('increment')
    crie_id: number;

    @Column({ type: 'varchar', length: 220, nullable: false, unique: false })
    crie_nombre: string;

    //Relacion UNO a MUCHOS CRITERIOS SIC - CUMPLIMIENTOSIC
    @OneToMany(type => CumplimientoEstandarSicEntity, cumplimiento_estandar => cumplimiento_estandar.criterioestandar_sic)
    cumplimiento_estandar: CumplimientoEstandarSicEntity;

}

