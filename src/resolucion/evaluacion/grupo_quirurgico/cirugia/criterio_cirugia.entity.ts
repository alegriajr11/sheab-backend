true/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CirugiaEntity } from "./cirugia.entity";
import { CumplimientoCirugiaEntity } from "./cumplimiento_cirugia.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";



@Entity({ name: 'criterio_cirugia' })
export class CriterioCirugiaEntity {
    @PrimaryGeneratedColumn('increment')
    cri_ciru_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_ciru_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_ciru_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_ciru_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_ciru_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CIRUGIA - CIRUGIA (ESTANDARES)
    @ManyToOne(type => CirugiaEntity, cirugia => cirugia.criterios_cirugia)
    cirugia: CirugiaEntity;

    //Relacion MUCHOS a UNO CRITERIOS_CIRUGIA - CUMPLIMIENTO CIRUGIA 
    @OneToOne(() => CumplimientoCirugiaEntity, cumplimiento => cumplimiento.criterio_cirugia)
    cumplimiento: CumplimientoCirugiaEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION_CRONICO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_cirugia)
    cirugia_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION_CRONICO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_cirugia)
    cirugia_aparto: ApartadoEntity;


}