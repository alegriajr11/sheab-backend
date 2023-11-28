/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CriterioIndEntity } from "./criterioind.entity";
import { EvaluacionIndependientesEntity } from "./evaluacion-independientes.entity";


@Entity({ name: 'etapaind' })
export class EtapaInd {
    @PrimaryGeneratedColumn('increment')
    eta_id: number;

    @Column({ type: 'varchar', length: 80, nullable: false, unique: false })
    eta_nombre: string;


    //Relacion Uno a Muchos Etapa - Criterio
    @OneToMany(type => CriterioIndEntity, criterio => criterio.eta_item)
    cri_criterio: CriterioIndEntity;

    //Relacion Muchos a Muchos ETAPA-INDEPENDIENTES - EVALUACION-INDEPENDIENTES


}