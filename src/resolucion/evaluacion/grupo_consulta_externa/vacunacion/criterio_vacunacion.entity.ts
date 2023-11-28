/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VacunacionEntity } from "./vacunacion.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoVacunacionEntity } from "./cumplimiento_vacunacion.entity";



@Entity({ name: 'criterio_vacunacion' })
export class CriterioVacunacionEntity {
    @PrimaryGeneratedColumn('increment')
    crivac_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crivac_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crivac_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crivac_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crivac_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_VACUNACION - VACUNACION (ESTANDARES)
    @ManyToOne(type => VacunacionEntity, vacunacion => vacunacion.criterios_vacunacion)
    vacunacion: VacunacionEntity;

    //RELACION ONTE TO ONE CRITERIOS VACUNACION A CUMPLIMIENTO VACUNACION
    @OneToOne(() => CumplimientoVacunacionEntity, cumplimiento => cumplimiento.criterio_vacunacion)
    cumplimiento: CumplimientoVacunacionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  VACUNACION - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_vacunacion)
    vacunacion_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  VACUNACION - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_vacunacion)
    vacunacion_apartado: ApartadoEntity;


}