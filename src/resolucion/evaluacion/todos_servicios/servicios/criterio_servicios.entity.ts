/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TodoServiciosEntity } from "./todos_servicios.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoServiciosEntity } from "./cumplimiento_servicios.entity";
// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'criterio_servicios' })
export class Criterio_servicios {
    @PrimaryGeneratedColumn('increment')
    cris_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cris_modalidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cris_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cris_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIO SERVICIOS - TODOS_SERVICIOS RESOLUCION 3100 - 2019
    @ManyToOne(type => TodoServiciosEntity, todosServicios => todosServicios.criteriosServ)
    todos_servicios: TodoServiciosEntity;

    //Relacion MUCHOS a UNO CRITERIOS_TODOS_SERVICIOS - CUMPLIMIENTO TODOS_SERVICIOS 
    @OneToOne(() => CumplimientoServiciosEntity, cumplimiento => cumplimiento.criterio_servicios)
    cumplimiento: CumplimientoServiciosEntity;

    //Relacion MUCHOS a UNO CRITERIOS  TODOS_SERVICIOS - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_todos_servi)
    todos_servi_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  TODOS_SERVICIOS - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_todos_servi)
    todos_servi_aparto: ApartadoEntity;

}