/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioPartoEntity } from "./criterio_parto.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'parto' })
export class PartoEntity {
    @PrimaryGeneratedColumn('increment')
    parto_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    parto_nombre_estandar: string;

    //Relacion UNO a MUCHOS PARTO (ESTANDARES) - CRITERIOS_PARTO
    @OneToMany(type => CriterioPartoEntity, cri_parto => cri_parto.parto)
    criterios_parto: CriterioPartoEntity;

    //RELACION MUCHOS A UNO DE PARTO CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_parto)
    parto_estan_servicios: ServicioEntity;

}
