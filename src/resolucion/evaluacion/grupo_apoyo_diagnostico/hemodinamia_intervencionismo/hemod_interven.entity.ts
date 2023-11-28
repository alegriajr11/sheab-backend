/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioHermoIntervenEntity } from "./criterio_hemo_inter.entity";





@Entity({ name: 'hermod_interven' })
export class HermodIntervenEntity {
    @PrimaryGeneratedColumn('increment')
    hermointer_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    hermointer_nombre_estandar: string;

    //Relacion UNO a MUCHOS HERMODINAMIA (ESTANDARES) - CRITERIOS_HERMODINAMIA
    @OneToMany(type => CriterioHermoIntervenEntity, cri_hermod_interven => cri_hermod_interven.hermod_interven)
    criterios_hermod_interven: CriterioHermoIntervenEntity;

    //Relación MUCHOS a UNO HERMODINAMIA - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.hermod_interven)
    // prestador: PrestadorEntity

}
