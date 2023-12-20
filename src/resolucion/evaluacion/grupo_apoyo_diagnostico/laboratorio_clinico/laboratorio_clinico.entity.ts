/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioLabClinicoEntity } from "./criterio_lab_clinico.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'lab_clinico' })
export class LabClinicoEntity {
    @PrimaryGeneratedColumn('increment')
    labclin_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    labclin_nombre_estandar: string;

    //Relacion UNO a MUCHOS LABORATORIO CLINICO (ESTANDARES) - CRITERIOS_LABORATORIO CLINICO
    @OneToMany(type => CriterioLabClinicoEntity, cri_lab_clinico => cri_lab_clinico.lab_clinico)
    criterios_lab_clinico: CriterioLabClinicoEntity;

    //RELACION MUCHOS A UNO DE LABORATORIO CLINICO CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_lab_clinico)
    lab_clinico_estan_servicios: ServicioEntity;


}
