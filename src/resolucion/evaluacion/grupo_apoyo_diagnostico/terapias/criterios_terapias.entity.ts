/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TerapiasEntity } from "./terapias.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoTerapiaEntity } from "./cumplimiento_terapias.entity";



@Entity({ name: 'criterio_terapia' })
export class CriterioTerapiaEntity {
    @PrimaryGeneratedColumn('increment')
    criter_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criter_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criter_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    criter_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    criter_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_TERAPIA - TERAPIA (ESTANDARES)
    @ManyToOne(type => TerapiasEntity, terapia => terapia.criterios_terapia)
    terapia: TerapiasEntity;

    //RELACION ONTE TO ONE CRITERIOS TERAPIA A CUMPLIMIENTO TERAPIA
    @OneToOne(() => CumplimientoTerapiaEntity, cumplimiento => cumplimiento.criterio_terapia)
    cumplimiento: CumplimientoTerapiaEntity;

    //Relacion MUCHOS a UNO CRITERIOS TERAPIA- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_terapia)
    terapia_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS TERAPIA- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_terapia)
    terapia_apartado: ApartadoEntity;


}