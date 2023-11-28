/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuimioterapiaEntity } from "./quimioterapia.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoQuimioterapiaEntity } from "./cumplimiento_quimioterapia.entity";



@Entity({ name: 'criterio_quimioterapia' })
export class CriterioQuimioterapiaEntity {
    @PrimaryGeneratedColumn('increment')
    criquim_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criquim_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criquim_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    criquim_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    criquim_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_QUIMIOTERAPIA - QUIMIOTERAPIA (ESTANDARES)
    @ManyToOne(type => QuimioterapiaEntity, quimioterapia => quimioterapia.criterios_quimioterapia)
    quimioterapia: QuimioterapiaEntity;

    //RELACION ONTE TO ONE CRITERIOS QUIMIOTERAPIA A CUMPLIMIENTO QUIMIOTERAPIA
    @OneToOne(() => CumplimientoQuimioterapiaEntity, cumplimiento => cumplimiento.criterio_quimioterapia)
    cumplimiento: CumplimientoQuimioterapiaEntity;

    //Relacion MUCHOS a UNO CRITERIOS QUIMIOTERAPIA- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_quimioterapia)
    quimioterapia_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS QUIMIOTERAPIA- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_quimioterapia)
    quimioterapia_apartado: ApartadoEntity;
}