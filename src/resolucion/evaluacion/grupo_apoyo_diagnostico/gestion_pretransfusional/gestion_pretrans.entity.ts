/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioGestionPretransfusionalEntity } from "./criterio_gestion_pretrans.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'gestion_pretransfusional' })
export class GestionPretransfusionalEntity {
    @PrimaryGeneratedColumn('increment')
    gestp_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    gestp_nombre_estandar: string;

    //Relacion UNO a MUCHOS GESTION PRETRANSFUSIONAL (ESTANDARES) - CRITERIOS_GESTION PRETRANSFUSIONAL
    @OneToMany(type => CriterioGestionPretransfusionalEntity, cri_gest_pretransfusional => cri_gest_pretransfusional.gestion_pretransfusional)
    criterios_gest_pretransfusional: CriterioGestionPretransfusionalEntity;

    //RELACION MUCHOS A UNO DE GESTION PRETRANSFUNCIONAL CON SERVICIOS 
    @ManyToOne(type => ServicioEntity,  servicio=>  servicio.servicios_gestion_pretrans)
    gestion_pretrans_estan_servicios: ServicioEntity;

}
