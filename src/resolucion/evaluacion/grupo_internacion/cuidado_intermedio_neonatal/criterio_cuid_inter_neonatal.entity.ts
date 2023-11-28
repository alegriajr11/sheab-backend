/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuidIntermNeonatalEntity } from "./cuid_inter_neonatal.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoCuidInterNeonatalEntity } from "./cumplimiento_cuid_inter_neonatal.entity";



@Entity({ name: 'criterio_cuid_interm_neonatal' })
export class CriterioCuidIntermNeonatalEntity {
    @PrimaryGeneratedColumn('increment')
    cri_inter_neon_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_inter_neon_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_inter_neon_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_inter_neon_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_inter_neon_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CUIDADO_INTERMEDIO_NEONATAL - CUIDADO_INTERMEDIO_NEONATAL (ESTANDARES)
    @ManyToOne(type => CuidIntermNeonatalEntity, cuid_inter_neonatal => cuid_inter_neonatal.criterios_cuid_inter_neonatal)
    cuid_inter_neonatal: CuidIntermNeonatalEntity;

    //RELACION ONTE TO ONE CRITERIOS CUIDADO_INTERMEDIO_NEONATAL A CUMPLIMIENTO CUIDADO_INTERMEDIO_NEONATAL
    @OneToOne(() => CumplimientoCuidInterNeonatalEntity, cumplimiento => cumplimiento.criterio_cuid_inter_neona)
    cumplimiento: CumplimientoCuidInterNeonatalEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_ADULTO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_inter_neo)
    inter_neo_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_ADULTO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_inter_neo)
    inter_neo_apartado: ApartadoEntity;
}