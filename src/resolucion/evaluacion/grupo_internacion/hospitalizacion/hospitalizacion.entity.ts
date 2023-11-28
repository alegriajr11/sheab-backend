/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioHospitalizacionEntity } from "./criterio_hospitalizacion.entity";






@Entity({ name: 'hospitalizacion' })
export class HospitalizacionEntity {
    @PrimaryGeneratedColumn('increment')
    hosp_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    hosp_nombre_estandar: string;

    //Relacion UNO a MUCHOS HOSPITALIZACION(ESTANDARES) - CRITERIOS_HOSPITALIZACION
    @OneToMany(type => CriterioHospitalizacionEntity, cri_hospitalizacion => cri_hospitalizacion.hospitalizacion)
    criterios_hospitalizacion: CriterioHospitalizacionEntity;


}
