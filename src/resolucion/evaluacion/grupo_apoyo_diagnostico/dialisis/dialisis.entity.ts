/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioDialisisEntity } from "./criterio_dialisis.entity";





@Entity({ name: 'dialisis' })
export class DialisisEntity {
    @PrimaryGeneratedColumn('increment')
    dial_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    dial_nombre_estandar: string;

    //Relacion UNO a MUCHOS VACUNACIÓN (ESTANDARES) - CRITERIOS_VACUNACIÓN
    @OneToMany(type => CriterioDialisisEntity, cri_dialisis => cri_dialisis.dialisis)
    criterios_dialisis: CriterioDialisisEntity;

    //Relación MUCHOS a UNO DIALISIS - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.dialisis)
    // prestador: PrestadorEntity

}
