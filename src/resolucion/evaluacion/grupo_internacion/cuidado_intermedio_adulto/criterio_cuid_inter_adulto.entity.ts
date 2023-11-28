/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuidIntermAdultoEntity } from "./cuid_inter_adulto.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoCuidInterAdultoEntity } from "./cumplimiento_cuid_inter_adulto.entity";



@Entity({ name: 'criterio_cuid_interm_adulto' })
export class CriterioCuidIntermAdultoEntity {
    @PrimaryGeneratedColumn('increment')
    cri_inter_adult_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_inter_adult_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_inter_adult_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_inter_adult_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_inter_adult_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CUIDADO_INTERMEDIO_ADULTO - CUIDADO_INTERMEDIO_ADULTO (ESTANDARES)
    @ManyToOne(type => CuidIntermAdultoEntity,  cuid_inter_adulto=> cuid_inter_adulto.criterios_cuid_inter_adulto)
    cuid_inter_adulto: CuidIntermAdultoEntity;

    //RELACION ONTE TO ONE CRITERIOS CUIDADO_INTERMEDIO_ADULTO A CUMPLIMIENTO CUIDADO_INTERMEDIO_ADULTO
    @OneToOne(() => CumplimientoCuidInterAdultoEntity, cumplimiento => cumplimiento.criterio_cuid_inter_adult)
    cumplimiento: CumplimientoCuidInterAdultoEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_ADULTO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_inter_adulto)
    inter_adulto_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_ADULTO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_inter_adulto)
    inter_adulto_apartado: ApartadoEntity;

}