/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuidInteNeonatalEntity } from "./criterio_cuid_intens_neonatal.entity";





@Entity({ name: 'cuid_int_neonatal' })
export class CuidInteNeonatalEntity {
    @PrimaryGeneratedColumn('increment')
    cuid_int_neona_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuid_int_neona_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_INTENSIVO_NEONATAL (ESTANDARES) - CRITERIOS_CUIDADO_BASICO_NEONATAL
    @OneToMany(type => CriterioCuidInteNeonatalEntity, cri_cuid_int_neonatal => cri_cuid_int_neonatal.cuid_int_neonatal)
    criterios_cuid_int_neonatal: CriterioCuidInteNeonatalEntity;

    //Relación MUCHOS a UNO CUIDADO_INTENSIVO_NEONATAL - PRESTAOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.cuid_int_neonatal)
    // prestador: PrestadorEntity

}
