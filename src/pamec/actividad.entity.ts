/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CriteriopamEntity } from "./criteriopam.entity";
import { EvaluacionPamecEntity } from "./evaluacion-pamec.entity";

@Entity({ name: 'actividad' })
export class ActividadEntity {
    @PrimaryGeneratedColumn('increment')
    act_id: number;

    @Column({ type: 'varchar', length: 70, nullable: false, unique: false })
    act_nombre: string;

    //Relacion Uno a Muchos ACTIVIDAD - CRITERIOPAM
    @OneToMany(type => CriteriopamEntity, criteriopam => criteriopam.crip_actividad)
    act_criteriopam: CriteriopamEntity;

   
}