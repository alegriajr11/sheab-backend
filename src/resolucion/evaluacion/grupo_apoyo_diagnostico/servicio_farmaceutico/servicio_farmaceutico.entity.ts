/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioSerFarmaceuticoEntity } from "./criterios_s_farmaceutico.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'servicio_farmaceutico' })
export class ServFarmaceuticoEntity {
    @PrimaryGeneratedColumn('increment')
    ser_farma_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    ser_farma_nombre_estandar: string;

    //Relacion UNO a MUCHOS SERVICIO_FARMACEUTICO (ESTANDARES) - CRITERIOS_SERVICIO_FARMACEUTICO
    @OneToMany(type => CriterioSerFarmaceuticoEntity, cri_ser_farmaceutico => cri_ser_farmaceutico.ser_farmaceutico)
    criterios_ser_farmaceutico: CriterioSerFarmaceuticoEntity;

    //RELACION MUCHOS A UNO DE SERVICIO_FARMACEUTICO CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_servi_farma)
    servi_farma_estan_servicios: ServicioEntity;

}
