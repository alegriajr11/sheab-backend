/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuidIntermAdultoEntity } from "./criterio_cuid_inter_adulto.entity";





@Entity({ name: 'cuid_interm_adulto' })
export class CuidIntermAdultoEntity {
    @PrimaryGeneratedColumn('increment')
    cuid_inter_adult_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuid_inter_adult_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_CUIDADO_INTERMEDIO_ADULTO (ESTANDARES) - CRITERIOS_CUIDADO_INTERMEDIO_ADULTO
    @OneToMany(type => CriterioCuidIntermAdultoEntity, cri_cuid_inter_adulto=> cri_cuid_inter_adulto.cuid_inter_adulto)
    criterios_cuid_inter_adulto: CriterioCuidIntermAdultoEntity;

    //Relación MUCHOS a UNO CUIDADO_INTERMEDIO_ADULTO - PRESTAOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.cuid_inter_adulto)
    // prestador: PrestadorEntity

}
