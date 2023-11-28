/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuelloUterinoEntity } from "./tom_muestras_cuello_uter.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoCuelloUterinoEntity } from "./cumplimiento_tom_muest_cuello.entity";



@Entity({ name: 'criterio_cuello_uterino' })
export class CriterioCuelloUterinoEntity {
    @PrimaryGeneratedColumn('increment')
    cri_cuel_ute_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_cuel_ute_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_cuel_ute_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_cuel_ute_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_cuel_ute_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_TOMA_MUESTRAS_CUELLO_UTERINO - TOMA_MUESTRAS_CUELLO_UTERINO (ESTANDARES)
    @ManyToOne(type => CuelloUterinoEntity, cuel_uterino => cuel_uterino.criterios_cuello_uterino)
    cue_uterino: CuelloUterinoEntity;

    //RELACION ONTE TO ONE CRITERIOS TOMA_MUESTRAS_CUELLO_UTERINO A CUMPLIMIENTO TOMA_MUESTRAS_CUELLO_UTERINO
    @OneToOne(() => CumplimientoCuelloUterinoEntity, cumplimiento => cumplimiento.criterio_cuello_uterino)
    cumplimiento: CumplimientoCuelloUterinoEntity;

    //Relacion MUCHOS a UNO CRITERIOS TOMA_MUESTRAS_CUELLO_UTERINO- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_cuello_uterino)
    cuello_uterino_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS TOMA_MUESTRAS_CUELLO_UTERINO- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_cuello_uterino)
    cuello_uterino_apartado: ApartadoEntity;

}