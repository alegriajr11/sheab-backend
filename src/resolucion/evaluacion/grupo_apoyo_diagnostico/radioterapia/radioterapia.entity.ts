/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioRadioterapiaEntity } from "./criterio_radioterapia.entity";





@Entity({ name: 'radioterapia' })
export class RadioterapiaEntity {
    @PrimaryGeneratedColumn('increment')
    radi_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    radi_nombre_estandar: string;

    //Relacion UNO a MUCHOS RADIOTERAPIA (ESTANDARES) - CRITERIOS_RADIOTERAPIA
    @OneToMany(type => CriterioRadioterapiaEntity, cri_radioterapia => cri_radioterapia.radioterapia)
    criterios_radioterapia: CriterioRadioterapiaEntity;

    //Relación MUCHOS a UNO RADIOTERAPIA - PRESTAOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.radioterapia)
    // prestador: PrestadorEntity

}
