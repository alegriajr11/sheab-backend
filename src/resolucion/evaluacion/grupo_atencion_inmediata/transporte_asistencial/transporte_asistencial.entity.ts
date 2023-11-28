/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioTranspAsistencialEntity } from "./criterio_trans_asistencial.entity";





@Entity({ name: 'transporte_asistencial' })
export class TranspAsistencialEntity {
    @PrimaryGeneratedColumn('increment')
    trans_asis_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    trans_asis_nombre_estandar: string;

    //Relacion UNO a MUCHOS TRANSPORTE_ASISTENCIAL (ESTANDARES) - CRITERIOS_TRANSPORTE_ASISTENCIAL
    @OneToMany(type => CriterioTranspAsistencialEntity, cri_transp_asistencial => cri_transp_asistencial.transp_asistencial)
    criterios_transp_asistencial: CriterioTranspAsistencialEntity;

    //Relación MUCHOS a UNO TRANSPORTE_ASISTENCIAL - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.transp_asistencial)
    // prestador: PrestadorEntity

}
