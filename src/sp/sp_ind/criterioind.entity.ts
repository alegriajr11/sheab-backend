/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CalificacionIndEntity } from "./calificacionind.entity";
import { EtapaInd } from "./etapaind.entity";



@Entity({ name: 'criterioind' })
export class CriterioIndEntity {
    @PrimaryGeneratedColumn('increment')
    cri_id: number;

    @Column({ type: 'varchar', length: 350, nullable: false, unique: false })
    cri_nombre: string;

    @Column({ type: 'varchar', length: 120, nullable: false, unique: false })
    cri_verificacion: string;

    //Relacion Muchos a Uno CRITERIOIND - ETAPAIND
    @ManyToOne(type => EtapaInd, item => item.cri_criterio)
    eta_item: EtapaInd

    //Relacion Uno a Muchos CRITERIO - CALIFICACION
    @OneToMany(type => CalificacionIndEntity, calificacion => calificacion.criterio_cal)
    calificaciones_cri: CalificacionIndEntity;

}