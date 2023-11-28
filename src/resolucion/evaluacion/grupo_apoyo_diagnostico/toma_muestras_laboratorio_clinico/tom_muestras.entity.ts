/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioMuestraLabClinicoEntity } from "./criterio_tom_muestras.entity";





@Entity({ name: 'muestras_lab_clinico' })
export class MuestrasLabClinicoEntity {
    @PrimaryGeneratedColumn('increment')
    mue_lab_cli_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    mue_lab_cli_nombre_estandar: string;

    //Relacion UNO a MUCHOS TOMA_MUESTRAS_LABORATORIO_CLINICO (ESTANDARES) - CRITERIOS_TOMA_MUESTRAS_LABORATORIO_CLINICO
    @OneToMany(type => CriterioMuestraLabClinicoEntity, cri_muest_lab_clinico => cri_muest_lab_clinico.tom_mue_lab_clinico)
    criterios_muest_lab_clinico: CriterioMuestraLabClinicoEntity;

    // //Relación MUCHOS a UNO TOMA_MUESTRAS_LABORATORIO_CLINICO - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.tom_mue_lab_clinico)
    // prestador: PrestadorEntity

}
