/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PatologiaEntity } from "./patologia.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoPatologiaEntity } from "./cumplimiento_patologia.entity";



@Entity({ name: 'criterio_patologia' })
export class CriterioPatologiaEntity {
    @PrimaryGeneratedColumn('increment')
    cripat_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cripat_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cripat_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cripat_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cripat_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_PATOLOGIA - PATOLOGIA (ESTANDARES)
    @ManyToOne(type => PatologiaEntity, patologia => patologia.criterios_patologia)
    patologia: PatologiaEntity;

    //RELACION ONTE TO ONE CRITERIOS PATOLOGIA A CUMPLIMIENTO PATOLOGIA
    @OneToOne(() => CumplimientoPatologiaEntity, cumplimiento => cumplimiento.criterio_patologia)
    cumplimiento: CumplimientoPatologiaEntity;

    //Relacion MUCHOS a UNO CRITERIOS PATOLOGIA- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_patologia)
    patologia_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS PATOLOGIA- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_patologia)
    patologia_apartado: ApartadoEntity;


}