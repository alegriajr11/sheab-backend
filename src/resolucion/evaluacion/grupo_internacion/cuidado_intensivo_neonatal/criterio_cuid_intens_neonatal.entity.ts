/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuidInteNeonatalEntity } from "./cuid_intens_neonatal.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoCuidIntNeonatalEntity } from "./cumplimiento_cuid_intens_neonatal.entity";



@Entity({ name: 'criterio_cuid_inte_neonatal' })
export class CriterioCuidInteNeonatalEntity {
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


    //Relacion MUCHOS a UNO CRITERIOS_CUIDADO_INTENSIVO_NEONATAL - CUIDADO_INTENSIVO_NEONATAL (ESTANDARES)
    @ManyToOne(type => CuidInteNeonatalEntity,  cuid_int_neonatal=> cuid_int_neonatal.criterios_cuid_int_neonatal)
    cuid_int_neonatal: CuidInteNeonatalEntity;
    
    //RELACION ONTE TO ONE CRITERIOS CUIDADO_INTENSIVO_NEONATAL A CUMPLIMIENTO CUIDADO_INTENSIVO_NEONATAL
    @OneToOne(() => CumplimientoCuidIntNeonatalEntity, cumplimiento => cumplimiento.criterio_cuid_int_neonatal)
    cumplimiento: CumplimientoCuidIntNeonatalEntity;
    
    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_NEONATAL - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_intens_neo)
    intens_neo_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_NEONATAL - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_intens_neo)
    intens_neo_apartado: ApartadoEntity;

}