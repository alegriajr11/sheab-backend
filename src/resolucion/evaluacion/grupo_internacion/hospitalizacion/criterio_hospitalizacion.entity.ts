/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HospitalizacionEntity } from "./hospitalizacion.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoHospitalizacionEntity } from "./cumplimiento_hospitalizacion.entity";



//NOMBRE BASE DE DATOS
@Entity({ name: 'criterio_hospitalizacion' })
export class CriterioHospitalizacionEntity {
    @PrimaryGeneratedColumn('increment')
    crihosp_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crihosp_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crihosp_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crihosp_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crihosp_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_HOSPITALIZACION - HOSPITALIZACION (ESTANDARES)
    @ManyToOne(type => HospitalizacionEntity, hospitalizacion => hospitalizacion.criterios_hospitalizacion)
    hospitalizacion: HospitalizacionEntity;

    //RELACION ONTE TO ONE CRITERIOS HOSPITALIZACION A CUMPLIMIENTO HOSPITALIZACION
    @OneToOne(() => CumplimientoHospitalizacionEntity, cumplimiento => cumplimiento.criterio_hospitalizacion)
    cumplimiento: CumplimientoHospitalizacionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_hospitalizacion)
    hospitalizacion_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_hospitalizacion)
    hospitalizacion_aparto: ApartadoEntity;
}

