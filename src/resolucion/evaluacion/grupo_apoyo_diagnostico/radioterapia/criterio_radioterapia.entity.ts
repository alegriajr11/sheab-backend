true/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RadioterapiaEntity } from "./radioterapia.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoRadioterapiaEntity } from "./cumplimiento_radioterapia.entity";



@Entity({ name: 'criterio_radioterapia' })
export class CriterioRadioterapiaEntity {
    @PrimaryGeneratedColumn('increment')
    crirad_ter_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crirad_ter_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crirad_ter_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crirad_ter_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crirad_ter_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_RADIOTERAPIA - RADIOTERAPIA (ESTANDARES)
    @ManyToOne(type => RadioterapiaEntity, radioterapia => radioterapia.criterios_radioterapia)
    radioterapia: RadioterapiaEntity;

    //RELACION ONTE TO ONE CRITERIOS RADIOTERAPIA A CUMPLIMIENTO RADIOTERAPIA
    @OneToOne(() => CumplimientoRadioterapiaEntity, cumplimiento => cumplimiento.criterio_radioterapia)
    cumplimiento: CumplimientoRadioterapiaEntity;

    //Relacion MUCHOS a UNO CRITERIOS RADIOTERAPIA - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_radio)
    radio_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS RADIOTERAPIA - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_radio)
    radio_apartado: ApartadoEntity;
}