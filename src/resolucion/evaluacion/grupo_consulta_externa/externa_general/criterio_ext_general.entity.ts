/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExternaGeneralEntity } from "./general.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoExternaGeneralEntity } from "./cumplimiento_ext_general.entity";


@Entity({ name: 'criterio_externa_general' })
export class CriterioExternaGeneralEntity {
    @PrimaryGeneratedColumn('increment')
    criextg_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criextg_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criextg_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    criextg_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    criextg_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CONSULTA_EXTERNA_GENERAL - EXTERNA_GENERAL (ESTANDARES)
    @ManyToOne(type => ExternaGeneralEntity, externa_general => externa_general.criterios_externa_general)
    externa_general: ExternaGeneralEntity;

    //RELACION ONTE TO ONE CRITERIOS EXTERNA_GENERAL A CUMPLIMIENTO EXTERNA_GENERAL
    @OneToOne(() => CumplimientoExternaGeneralEntity, cumplimiento => cumplimiento.criterio_externa_general)
    cumplimiento: CumplimientoExternaGeneralEntity;

    //Relacion MUCHOS a UNO CRITERIOS  EXTERNA_GENERAL- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_ext_general)
    ext_general_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  EXTERNA_GENERAL- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_ext_general)
    ext_general_apartado: ApartadoEntity;


}