/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioQuimioterapiaEntity } from "./criterio_quimioterapia.entity";





@Entity({ name: 'quimioterapia' })
export class QuimioterapiaEntity {
    @PrimaryGeneratedColumn('increment')
    quim_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    quim_nombre_estandar: string;

    //Relacion UNO a MUCHOS QUIMIOTERAPIA (ESTANDARES) - CRITERIOS_QUIMIOTERAPIA
    @OneToMany(type => CriterioQuimioterapiaEntity, cri_quimioterapia => cri_quimioterapia.quimioterapia)
    criterios_quimioterapia: CriterioQuimioterapiaEntity;

    //Relación MUCHOS a UNO QUIMIOTERAPIA - PRESTAOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.quimioterapia)
    // prestador: PrestadorEntity

}
