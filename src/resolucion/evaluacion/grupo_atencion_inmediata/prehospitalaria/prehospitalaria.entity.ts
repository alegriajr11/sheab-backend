/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioPrehospitalariaEntity } from "./criterio_prehospitalaria.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'prehospitalaria' })
export class PrehospitalariaEntity {
    @PrimaryGeneratedColumn('increment')
    parto_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    parto_nombre_estandar: string;

    //Relacion UNO a MUCHOS PREHOSPITALARIA (ESTANDARES) - CRITERIOS_PREHOSPITALARIA
    @OneToMany(type => CriterioPrehospitalariaEntity, cri_prehospitalaria => cri_prehospitalaria.prehospitalaria)
    criterios_prehospitalaria: CriterioPrehospitalariaEntity;

    //RELACION MUCHOS A UNO DE PREHOSPITALARIA CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_prehospitalaria)
    prehospitalaria_estan_servicios: ServicioEntity;

}
