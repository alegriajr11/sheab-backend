/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioHospitalizacionParcialEntity } from "./criterio_hosp_parcial.entity";





@Entity({ name: 'hospitalizacion_parcial' })
export class HospitalizacionParcialEntity {
    @PrimaryGeneratedColumn('increment')
    hosp_parc__id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    hosp_parc_nombre_estandar: string;

    //Relacion UNO a MUCHOS HOSPITALIZACION_PARCIAL (ESTANDARES) - CRITERIOS_HOSPITALIZACION_PARCIAL
    @OneToMany(type => CriterioHospitalizacionParcialEntity, cri_hospitalizacion_parcial => cri_hospitalizacion_parcial.hospitalizacion_parcial)
    criterios_hospitalizacion_parcial: CriterioHospitalizacionParcialEntity;

    //Relación MUCHOS a UNO HOSPITALIZACION_PARCIAL - PRESTAOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.hospitalizacion_parcial)
    // prestador: PrestadorEntity

}
