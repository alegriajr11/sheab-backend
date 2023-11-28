/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioGestionPretransfusionalEntity } from "./criterio_gestion_pretrans.entity";





@Entity({ name: 'gestion_pretransfusional' })
export class GestionPretransfusionalEntity {
    @PrimaryGeneratedColumn('increment')
    gestp_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    gestp_nombre_estandar: string;

    //Relacion UNO a MUCHOS GESTION PRETRANSFUSIONAL (ESTANDARES) - CRITERIOS_GESTION PRETRANSFUSIONAL
    @OneToMany(type => CriterioGestionPretransfusionalEntity, cri_gest_pretransfusional => cri_gest_pretransfusional.gestion_pretransfusional)
    criterios_gest_pretransfusional: CriterioGestionPretransfusionalEntity;

    //Relación MUCHOS a UNO GESTION PRETRANSFUSIONAL - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.gest_pretransfusional)
    // prestador: PrestadorEntity

}
