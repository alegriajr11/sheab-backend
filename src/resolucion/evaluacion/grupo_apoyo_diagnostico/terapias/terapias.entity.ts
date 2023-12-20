/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioTerapiaEntity } from "./criterios_terapias.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'terapias' })
export class TerapiasEntity {
    @PrimaryGeneratedColumn('increment')
    ter_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    ter_nombre_estandar: string;

    //Relacion UNO a MUCHOS TERAPIA (ESTANDARES) - CRITERIOS_TERAPIA
    @OneToMany(type => CriterioTerapiaEntity, cri_terapia => cri_terapia.terapia)
    criterios_terapia: CriterioTerapiaEntity;

    //RELACION MUCHOS A UNO DE TERAPIA CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_terapia)
    terapia_estan_servicios: ServicioEntity;

}
