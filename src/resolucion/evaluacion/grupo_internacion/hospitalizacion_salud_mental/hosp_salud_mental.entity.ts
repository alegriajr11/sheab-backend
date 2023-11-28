/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioHospitalizacionMentalEntity } from "./criterio_hosp_salud_mental.entity";





@Entity({ name: 'hospitalizacion_mental' })
export class HospitalizacionMentalEntity {
    @PrimaryGeneratedColumn('increment')
    hosp_mental_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    hosp_mental_nombre_estandar: string;

    //Relacion UNO a MUCHOS HOSPITALIZACION_MENTAL (ESTANDARES) - CRITERIOS_HOSPITALIZACION_MENTAL
    @OneToMany(type => CriterioHospitalizacionMentalEntity, cri_hospitalizacion_mental => cri_hospitalizacion_mental.hospitalizacion_mental)
    criterios_hospitalizacion_mental: CriterioHospitalizacionMentalEntity;

    //Relación MUCHOS a UNO HOSPITALIZACION_MENTAL - PRESTAOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.hospitalizacion_mental)
    // prestador: PrestadorEntity

}
