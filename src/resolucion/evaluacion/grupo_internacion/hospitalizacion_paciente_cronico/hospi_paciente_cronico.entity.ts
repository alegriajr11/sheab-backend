/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioHospitCronicoEntity } from "./criterio_hosp_paciente_cron.entity";





@Entity({ name: 'hospitalizacion_cronico' })
export class HospitalizacionCronicoEntity {
    @PrimaryGeneratedColumn('increment')
    hosp_cron_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    hosp_cron_nombre_estandar: string;

    //Relacion UNO a MUCHOS HOSPITALIZACION_CRONICO (ESTANDARES) - CRITERIOS_HOSPITALIZACION_CRONICO
    @OneToMany(type => CriterioHospitCronicoEntity, cri_hospit_cronico => cri_hospit_cronico.hospit_cronico)
    criterios_hospit_cronico: CriterioHospitCronicoEntity;

    //Relación MUCHOS a UNO HOSPITALIZACION_CRONICO - PRESTAOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.hospit_cronico)
    // prestador: PrestadorEntity

}
