/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CriterioVacunacionEntity } from "./criterio_vacunacion.entity";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'vacunacion' })
export class VacunacionEntity {
    @PrimaryGeneratedColumn('increment')
    vac_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    vac_nombre_estandar: string;

    //Relacion UNO a MUCHOS VACUNACIÓN (ESTANDARES) - CRITERIOS_VACUNACIÓN
    @OneToMany(type => CriterioVacunacionEntity, cri_vacunacion => cri_vacunacion.vacunacion)
    criterios_vacunacion: CriterioVacunacionEntity;

    //RELACION MUCHOS A UNO DE VACUNACION CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_vacunacion)
    vacunacion_estan_servicios: ServicioEntity;

}
