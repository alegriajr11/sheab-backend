/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SaludTrabajoEntity } from "./salud_trabajo.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoSaludTrabajoEntity } from "./cumplimiento_salud_trabajo.entity";



@Entity({ name: 'criterio_salud_trabajo' })
export class CriterioSaludTrabajoEntity {
    @PrimaryGeneratedColumn('increment')
    crisaltra_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crisaltra_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crisaltra_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crisaltra_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crisaltra_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_SEGURIDAD Y SALUD EN EL TRABAJO - SEGURIDAD Y SALUD EN EL TRABAJO  (ESTANDARES)
    @ManyToOne(type => SaludTrabajoEntity, salud_trabajo => salud_trabajo.criterios_salud_trabajo)
    salud_trabajo: SaludTrabajoEntity;

    //RELACION ONTE TO ONE CRITERIOS SEGURIDAD Y SALUD EN EL TRABAJO A CUMPLIMIENTO SEGURIDAD Y SALUD EN EL TRABAJO
    @OneToOne(() => CumplimientoSaludTrabajoEntity, cumplimiento => cumplimiento.criterio_salud_trabajo)
    cumplimiento: CumplimientoSaludTrabajoEntity;


    //Relacion MUCHOS a UNO CRITERIOS  SEGURIDAD Y SALUD EN EL TRABAJO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_salud_trabajo)
    salud_trabajo_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  SEGURIDAD Y SALUD EN EL TRABAJO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_salud_trabajo)
    salud_trabajo_apartado: ApartadoEntity;

}