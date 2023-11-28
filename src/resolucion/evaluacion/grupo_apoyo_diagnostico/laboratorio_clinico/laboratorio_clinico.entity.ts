/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioLabClinicoEntity } from "./criterio_lab_clinico.entity";





@Entity({ name: 'lab_clinico' })
export class LabClinicoEntity {
    @PrimaryGeneratedColumn('increment')
    labclin_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    labclin_nombre_estandar: string;

    //Relacion UNO a MUCHOS LABORATORIO CLINICO (ESTANDARES) - CRITERIOS_LABORATORIO CLINICO
    @OneToMany(type => CriterioLabClinicoEntity, cri_lab_clinico => cri_lab_clinico.lab_clinico)
    criterios_lab_clinico: CriterioLabClinicoEntity;

    //Relación MUCHOS a UNO LAB_CLINICO - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.lab_clinico)
    // prestador: PrestadorEntity

}
