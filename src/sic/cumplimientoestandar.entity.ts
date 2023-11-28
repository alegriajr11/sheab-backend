/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioEstandarSicEntity } from "./criteriosEstandar.entity";
import { IndicadorEntity } from "./indicador.entity";
import { EvaluacionSicEntity } from "./evaluacionsic.entity";


@Entity({ name: 'cumplimiento_estandarsic' })
export class CumplimientoEstandarSicEntity {
    @PrimaryGeneratedColumn('increment')
    cumpl_id: number;

    @Column({ type: 'varchar', length: 11, nullable: false, unique: false })
    cumpl_cumple: string;

    @Column({ type: 'varchar', length: 300, nullable: true, unique: false })
    cumpl_observaciones: string;

    @Column({ type: 'varchar', length: 11, nullable: false})
    cumpl_asignado: string

    //Relacion MUCHOS a UNO CUMPLIMIENTOESTANDAR - CRITERIOSESTANDAR SIC
    @ManyToOne(type => CriterioEstandarSicEntity, criterio_sic => criterio_sic.cumplimiento_estandar)
    criterioestandar_sic: CriterioEstandarSicEntity;

    //Relacion MUCHOS a UNO DOMINIO - EVALUACION SIC
    @ManyToOne(type => EvaluacionSicEntity, evasic => evasic.eva_sic_cumplimiento)
    cumplimiento_eva_sic: EvaluacionSicEntity;
}