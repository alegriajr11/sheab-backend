/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Criterio_servicios } from "./criterio_servicios.entity";
// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'todos_servicios' })
export class TodoServiciosEntity {
    @PrimaryGeneratedColumn('increment')
    tod_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    tod_nombre_estandar: string;

    //Relacion UNO a MUCHOS TODOS_SERVICIOS - CRITERIOS_TODOS_SERVICIOS
    @OneToMany(type => Criterio_servicios,  criServicios=> criServicios.todos_servicios)
    criteriosServ: Criterio_servicios;





}
