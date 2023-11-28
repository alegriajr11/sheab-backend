true/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HospitalizacionParcialEntity } from "./hospitalizacion_parcial.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoHospitalizacionParcialEntity } from "./cumplimiento_hosp_parcial.entity";



@Entity({ name: 'criterio_hospitalizacion_parcial' })
export class CriterioHospitalizacionParcialEntity {
    @PrimaryGeneratedColumn('increment')
    crihosp_parc_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crihosp_parc_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crihosp_parc_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crihosp_parc_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crihosp_parc_nombre_criterio: string;

    //Relacion MUCHOS a UNO CRITERIOS_HOSPITALIZACION_PARCIAL - HOSPITALIZACION_PARCIAL (ESTANDARES)
    @ManyToOne(type => HospitalizacionParcialEntity, hospitalizacion_parcial => hospitalizacion_parcial.criterios_hospitalizacion_parcial)
    hospitalizacion_parcial: HospitalizacionParcialEntity;

    //RELACION ONTE TO ONE CRITERIOS HOSPITALIZACION_PARCIAL A CUMPLIMIENTO HOSPITALIZACION_PARCIAL
    @OneToOne(() => CumplimientoHospitalizacionParcialEntity, cumplimiento => cumplimiento.criterio_hospitalizacion_parcial)
    cumplimiento: CumplimientoHospitalizacionParcialEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION_PARCIAL - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_hosp_parcial)
    hosp_parcial_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION_PARCIAL - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_hosp_parcial)
    hosp_parcial_aparto: ApartadoEntity;
}