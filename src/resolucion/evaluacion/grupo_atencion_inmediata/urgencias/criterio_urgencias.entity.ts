/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UrgenciasEntity } from "./urgencias.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoUrgenciasEntity } from "./cumplimiento_urgencias.entity";



@Entity({ name: 'criterio_urgencias' })
export class CriterioUrgenciasEntity {
    @PrimaryGeneratedColumn('increment')
    criurge_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criurge_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criurge_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    criurge_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    criurge_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_URGENCIAS - URGENCIAS (ESTANDARES)
    @ManyToOne(type => UrgenciasEntity, urgencias => urgencias.criterios_urgencias)
    urgencias: UrgenciasEntity;

    //RELACION ONTE TO ONE CRITERIOS URGENCIAS A CUMPLIMIENTO URGENCIAS
    @OneToOne(() => CumplimientoUrgenciasEntity, cumplimiento => cumplimiento.criterio_urgencias)
    cumplimiento: CumplimientoUrgenciasEntity;

    //Relacion MUCHOS a UNO CRITERIOS URGENCIASL- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_urgencias)
    urgencias_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS URGENCIAS- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_urgencias)
    urgencias_apartado: ApartadoEntity;

}