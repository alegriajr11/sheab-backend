/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioTerapiaEntity } from "./criterios_terapias.entity";





@Entity({ name: 'terapias' })
export class TerapiasEntity {
    @PrimaryGeneratedColumn('increment')
    ter_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    ter_nombre_estandar: string;

    //Relacion UNO a MUCHOS TERAPIA (ESTANDARES) - CRITERIOS_TERAPIA
    @OneToMany(type => CriterioTerapiaEntity, cri_terapia => cri_terapia.terapia)
    criterios_terapia: CriterioTerapiaEntity;

    //Relación MUCHOS a UNO TERAPIA - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.terapia)
    // prestador: PrestadorEntity

}
