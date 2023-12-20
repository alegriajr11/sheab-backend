/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioLabHistotecnologiaEntity } from "./criterio_lab_histotec.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'lab_histotecnologia' })
export class LabHistotecnologiaEntity {
    @PrimaryGeneratedColumn('increment')
    labhisto_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    labhisto_nombre_estandar: string;

    //Relacion UNO a MUCHOS LABORATORIO HISTOTECNOLOGIA (ESTANDARES) - CRITERIOS_LABORATORIO HISTOTECNOLOGIA
    @OneToMany(type => CriterioLabHistotecnologiaEntity, cri_lab_histotecnologia => cri_lab_histotecnologia.lab_histotecnologia)
    criterios_lab_histotecnologia: CriterioLabHistotecnologiaEntity;

    //RELACION MUCHOS A UNO DE LABORATORIO HISTOTECNOLOGIA CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_lab_histotec)
    lab_histotec_estan_servicios: ServicioEntity;

}
