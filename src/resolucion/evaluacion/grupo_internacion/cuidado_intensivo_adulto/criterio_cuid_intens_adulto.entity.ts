/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuidIntAdultoEntity } from "./cuid_intens_adulto.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoIntAdultoEntity } from "./cumplimiento_cuid_intens_adulto.entity";



@Entity({ name: 'criterio_cuid_intens_adulto' })
export class CriterioCuidIntensAdultoEntity {
    @PrimaryGeneratedColumn('increment')
    cri_int_adult_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_int_adult_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_int_adult_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_int_adult_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_int_adult_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CUIDADO_INTENSIVO_ADULTO - CUIDADO_INTENSIVO_ADULTO (ESTANDARES)
    @ManyToOne(type => CuidIntAdultoEntity,  cuid_int_adulto=> cuid_int_adulto.criterios_cuid_int_adulto)
    cuid_int_adulto: CuidIntAdultoEntity;

    //RELACION ONTE TO ONE CRITERIOS CUIDADO_INTENSIVO_ADULTO A CUMPLIMIENTO CUIDADO_INTENSIVO_ADULTO
    @OneToOne(() => CumplimientoIntAdultoEntity, cumplimiento => cumplimiento.criterio_cuid_int_adulto)
    cumplimiento: CumplimientoIntAdultoEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_ADULTO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_intens_adulto)
    intens_adulto_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  CUIDADO_INTENSIVO_ADULTO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_intens_adulto)
    intens_adulto_apartado: ApartadoEntity;
}