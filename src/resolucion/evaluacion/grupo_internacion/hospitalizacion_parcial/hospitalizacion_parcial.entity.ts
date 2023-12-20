/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioHospitalizacionParcialEntity } from "./criterio_hosp_parcial.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'hospitalizacion_parcial' })
export class HospitalizacionParcialEntity {
    @PrimaryGeneratedColumn('increment')
    hosp_parc__id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    hosp_parc_nombre_estandar: string;

    //Relacion UNO a MUCHOS HOSPITALIZACION_PARCIAL (ESTANDARES) - CRITERIOS_HOSPITALIZACION_PARCIAL
    @OneToMany(type => CriterioHospitalizacionParcialEntity, cri_hospitalizacion_parcial => cri_hospitalizacion_parcial.hospitalizacion_parcial)
    criterios_hospitalizacion_parcial: CriterioHospitalizacionParcialEntity;

    //RELACION MUCHOS A UNO DE HOSPITALIZACION_PARCIAL CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_hospi_parcial)
    hospi_parcial_estan_servicios: ServicioEntity;

}
