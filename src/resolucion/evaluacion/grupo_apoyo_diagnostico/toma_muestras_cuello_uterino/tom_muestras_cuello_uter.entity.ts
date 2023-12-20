/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuelloUterinoEntity } from "./criterio_tom_muest_cuello.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'cuello_uterino' })
export class CuelloUterinoEntity {
    @PrimaryGeneratedColumn('increment')
    cuel_ute_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuel_ute_nombre_estandar: string;

    //Relacion UNO a MUCHOS TOMA_MUESTRAS_CUELLO_UTERINO (ESTANDARES) - CRITERIOS_TOMA_MUESTRAS_CUELLO_UTERINO
    @OneToMany(type => CriterioCuelloUterinoEntity, cri_cuello_uterino => cri_cuello_uterino.cue_uterino)
    criterios_cuello_uterino: CriterioCuelloUterinoEntity;

    //RELACION MUCHOS A UNO DE TOMA_MUESTRAS_CUELLO_UTERINO CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_cuello_uterino)
    cuello_uterino_estan_servicios: ServicioEntity;

}
