/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuidBasNeonatalEntity } from "./cuid_basic_neonatal.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoCuidBasNeonatalEntity } from "./cumplimiento_cuid_basic_neonatal.entity";



@Entity({ name: 'criterio_cuid_bas_neonatal' })
export class CriterioCuidBasNeonatalEntity {
    @PrimaryGeneratedColumn('increment')
    cri_neona_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_neona_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_neona_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_neona_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_neona_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CUIDADO_BASICO_NEONATAL - CUIDADO_BASICO_NEONATAL (ESTANDARES)
    @ManyToOne(type => CuidBasNeonatalEntity, cuid_bas_neonatal => cuid_bas_neonatal.criterios_cuid_bas_neonatal)
    cuid_bas_neonatal: CuidBasNeonatalEntity;

    //RELACION ONTE TO ONE CRITERIOS CUIDADO_BASICO_NEONATAL A CUMPLIMIENTO CUIDADO_BASICO_NEONATAL
    @OneToOne(() => CumplimientoCuidBasNeonatalEntity, cumplimiento => cumplimiento.criterio_cuid_bas_neonatal)
    cumplimiento: CumplimientoCuidBasNeonatalEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_BASICO_NEONATAL - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_basico_neonatal)
    basico_neonatal_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_BASICO_NEONATAL - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_basico_neonatal)
    basico_neonatal_apartado: ApartadoEntity;

}