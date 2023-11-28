/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioUrgenciasEntity } from "./criterio_urgencias.entity";





@Entity({ name: 'urgencias' })
export class UrgenciasEntity {
    @PrimaryGeneratedColumn('increment')
    urg_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    urg_nombre_estandar: string;

    //Relacion UNO a MUCHOS URGENCIAS (ESTANDARES) - CRITERIOS_URGENCIAS
    @OneToMany(type => CriterioUrgenciasEntity, cri_urgencias => cri_urgencias.urgencias)
    criterios_urgencias: CriterioUrgenciasEntity;

    //Relación MUCHOS a UNO URGENCIAS - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.urgencias)
    // prestador: PrestadorEntity

}
