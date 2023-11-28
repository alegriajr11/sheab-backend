/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuidIntePediatricoEntity } from "./cuid_intens_pediatrico.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoCuidIntPediatricoEntity } from "./cumplimiento_cuid_intens_pediatrico.entity";



@Entity({ name: 'criterio_cuid_inte_pediatrico' })
export class CriterioCuidIntePediatricoEntity {
    @PrimaryGeneratedColumn('increment')
    cri_int_ped_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_int_ped_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_int_ped_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_int_ped_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_int_ped_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CUIDADO_INTENSIVO_PEDIATRICO - CUIDADO_INTENSIVO_PEDIATRICO (ESTANDARES)
    @ManyToOne(type => CuidIntePediatricoEntity, cuid_int_pediatrico => cuid_int_pediatrico.criterios_cuid_int_pediatrico)
    cuid_int_pediatrico: CuidIntePediatricoEntity;

    //RELACION ONTE TO ONE CRITERIOS CUIDADO_INTENSIVO_PEDIATRICO A CUMPLIMIENTO CUIDADO_INTENSIVO_PEDIATRICO
    @OneToOne(() => CumplimientoCuidIntPediatricoEntity, cumplimiento => cumplimiento.criterio_cuid_int_pediatrico)
    cumplimiento: CumplimientoCuidIntPediatricoEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_ADULTO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_intens_pedi)
    intens_pedi_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_ADULTO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_intens_pedi)
    intens_pedi_apartado: ApartadoEntity;
}