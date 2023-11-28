/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuidIntermPediatricoEntity } from "./cuid_inter_pediatrico.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoCuidInterPediatricoEntity } from "./cumplimiento_cuid_inter_pediatrico.entity";



@Entity({ name: 'criterio_cuid_interm_pediatrico' })
export class CriterioCuidIntermPediatricoEntity {
    @PrimaryGeneratedColumn('increment')
    cri_inter_pedia_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_inter_pedia_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_inter_pedia_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_inter_pedia_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_inter_pedia_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CUIDADO_INTERMEDIO_PEDIATRICO - CUIDADO_INTERMEDIO_PEDIATRICO (ESTANDARES)
    @ManyToOne(type => CuidIntermPediatricoEntity, cuid_inter_pediatrico => cuid_inter_pediatrico.criterios_cuid_inter_pediatrico)
    cuid_inter_pediatrico: CuidIntermPediatricoEntity;

    //RELACION ONTE TO ONE CRITERIOS CUIDADO_INTERMEDIO_PEDIATRICO A CUMPLIMIENTO CUIDADO_INTERMEDIO_PEDIATRICO
    @OneToOne(() => CumplimientoCuidInterPediatricoEntity, cumplimiento => cumplimiento.criterio_cuid_inter_pedia)
    cumplimiento: CumplimientoCuidInterPediatricoEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTERMEDIO_PEDIATRICO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_inter_pedi)
    inter_pedi_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTERMEDIO_PEDIATRICO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_inter_pedi)
    inter_pedi_aparto: ApartadoEntity;
}