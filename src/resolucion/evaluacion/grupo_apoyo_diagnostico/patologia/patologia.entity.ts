/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioPatologiaEntity } from "./criterio_patologia.entity";





@Entity({ name: 'patologia' })
export class PatologiaEntity {
    @PrimaryGeneratedColumn('increment')
    pato_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    pato_nombre_estandar: string;

    //Relacion UNO a MUCHOS PATOLOGIA (ESTANDARES) - CRITERIOS_PATOLOGIA
    @OneToMany(type => CriterioPatologiaEntity, cri_patologia => cri_patologia.patologia)
    criterios_patologia: CriterioPatologiaEntity;

    //Relación MUCHOS a UNO PATOLOGIA - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.patologia)
    // prestador: PrestadorEntity

}
