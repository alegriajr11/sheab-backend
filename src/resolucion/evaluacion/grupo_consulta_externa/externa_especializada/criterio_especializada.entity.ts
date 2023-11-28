/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExternaEspecializadaEntity } from "./especializada.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoEspecializadaEntity } from "./cumplimiento_especializada.entity";



@Entity({ name: 'criterio_externa_especializada' })
export class CriterioEspecializadaEntity {
    @PrimaryGeneratedColumn('increment')
    criextg_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criexte_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criexte_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    criexte_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    criexte_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CONSULTA_EXTERNA_ESPECIALIZADA - EXTERNA_ESPECIALIZADA (ESTANDARES)
    @ManyToOne(type => ExternaEspecializadaEntity, externa_especializada => externa_especializada.criterios_externa_especializada)
    externa_especializada: ExternaEspecializadaEntity;

    //RELACION ONTE TO ONE CRITERIOS EXTERNA_ESPECIALIZADA A CUMPLIMIENTO EXTERNA_ESPECIALIZADA
    @OneToOne(() => CumplimientoEspecializadaEntity, cumplimiento => cumplimiento.criterio_externa_especializada)
    cumplimiento: CumplimientoEspecializadaEntity;

    //Relacion MUCHOS a UNO CRITERIOS EXTERNA_ESPECIALIZADA- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_ext_especial)
    ext_especial_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS EXTERNA_ESPECIALIZADA- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_ext_especial)
    ext_especial_apartado: ApartadoEntity;


}