/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioSerFarmaceuticoEntity } from "./criterios_s_farmaceutico.entity";





@Entity({ name: 'servicio_farmaceutico' })
export class ServFarmaceuticoEntity {
    @PrimaryGeneratedColumn('increment')
    ser_farma_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    ser_farma_nombre_estandar: string;

    //Relacion UNO a MUCHOS SERVICIO_FARMACEUTICO (ESTANDARES) - CRITERIOS_SERVICIO_FARMACEUTICO
    @OneToMany(type => CriterioSerFarmaceuticoEntity, cri_ser_farmaceutico => cri_ser_farmaceutico.ser_farmaceutico)
    criterios_ser_farmaceutico: CriterioSerFarmaceuticoEntity;

    //Relación MUCHOS a UNO SERVICIO_FARMACEUTICO - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.ser_farmaceutico)
    // prestador: PrestadorEntity

}
