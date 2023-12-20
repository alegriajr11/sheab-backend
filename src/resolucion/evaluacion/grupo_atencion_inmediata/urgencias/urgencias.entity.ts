/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioUrgenciasEntity } from "./criterio_urgencias.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'urgencias' })
export class UrgenciasEntity {
    @PrimaryGeneratedColumn('increment')
    urg_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    urg_nombre_estandar: string;

    //Relacion UNO a MUCHOS URGENCIAS (ESTANDARES) - CRITERIOS_URGENCIAS
    @OneToMany(type => CriterioUrgenciasEntity, cri_urgencias => cri_urgencias.urgencias)
    criterios_urgencias: CriterioUrgenciasEntity;

    //RELACION MUCHOS A UNO DE URGENCIAS CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_urgencias)
    urgencias_estan_servicios: ServicioEntity;

}
