/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioQuimioterapiaEntity } from "./criterio_quimioterapia.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'quimioterapia' })
export class QuimioterapiaEntity {
    @PrimaryGeneratedColumn('increment')
    quim_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    quim_nombre_estandar: string;

    //Relacion UNO a MUCHOS QUIMIOTERAPIA (ESTANDARES) - CRITERIOS_QUIMIOTERAPIA
    @OneToMany(type => CriterioQuimioterapiaEntity, cri_quimioterapia => cri_quimioterapia.quimioterapia)
    criterios_quimioterapia: CriterioQuimioterapiaEntity;

    //RELACION MUCHOS A UNO DE QUIMIOTERAPIA CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_quimioterapia)
    quimioterapia_estan_servicios: ServicioEntity;

}
