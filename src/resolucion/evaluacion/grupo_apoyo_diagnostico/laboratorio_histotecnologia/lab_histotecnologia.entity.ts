/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioLabHistotecnologiaEntity } from "./criterio_lab_histotec.entity";





@Entity({ name: 'lab_histotecnologia' })
export class LabHistotecnologiaEntity {
    @PrimaryGeneratedColumn('increment')
    labhisto_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    labhisto_nombre_estandar: string;

    //Relacion UNO a MUCHOS LABORATORIO HISTOTECNOLOGIA (ESTANDARES) - CRITERIOS_LABORATORIO HISTOTECNOLOGIA
    @OneToMany(type => CriterioLabHistotecnologiaEntity, cri_lab_histotecnologia => cri_lab_histotecnologia.lab_histotecnologia)
    criterios_lab_histotecnologia: CriterioLabHistotecnologiaEntity;

    //Relación MUCHOS a UNO LAB_HISTOTECNOLOGIA - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.lab_histotecnologia)
    // prestador: PrestadorEntity

}
