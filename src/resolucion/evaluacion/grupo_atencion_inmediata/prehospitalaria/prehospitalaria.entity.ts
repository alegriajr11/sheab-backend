/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioPrehospitalariaEntity } from "./criterio_prehospitalaria.entity";





@Entity({ name: 'prehospitalaria' })
export class PrehospitalariaEntity {
    @PrimaryGeneratedColumn('increment')
    parto_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    parto_nombre_estandar: string;

    //Relacion UNO a MUCHOS PREHOSPITALARIA (ESTANDARES) - CRITERIOS_PREHOSPITALARIA
    @OneToMany(type => CriterioPrehospitalariaEntity, cri_prehospitalaria => cri_prehospitalaria.prehospitalaria)
    criterios_prehospitalaria: CriterioPrehospitalariaEntity;

    //Relación MUCHOS a UNO PREHOSPITALARIA - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.prehospitalaria)
    // prestador: PrestadorEntity

}
