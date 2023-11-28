/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioEstandarSicEntity } from "./criteriosEstandar.entity";
import { CriteriosicEntity } from "./criteriosic.entity";
import { IndicadorEntity } from "./indicador.entity";
import { EvaluacionSicEntity } from "./evaluacionsic.entity";


@Entity({ name: 'cumplimientosic' })
export class CumplimientoSicEntity {
    @PrimaryGeneratedColumn('increment')
    cumpl_id: number;

    @Column({ type: 'varchar', length: 11, nullable: false, unique: false })
    cumpl_cumple: string;

    @Column({ type: 'varchar', length: 300, nullable: false, unique: false })
    cumpl_observaciones: string;

    @Column({ type: 'varchar', length: 11, nullable: false})
    cumpl_asignado: string

    //Relacion MUCHOS a UNO CUMPLIMIENTO - CRITERIOS SIC
    @ManyToOne(type => CriteriosicEntity, criterio_sic => criterio_sic.cumplimiento_sic)
    criterio_sic: CriteriosicEntity;

    //Relacion MUCHOS a UNO CUMPLIMIENTO - INDICADOR SIC
    @ManyToOne(type => IndicadorEntity, criterio_sic => criterio_sic.cumplimiento_sic)
    indicadorsic: IndicadorEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionSicEntity, evasic => evasic.eva_sic_cump)
    cump_eva_sic: EvaluacionSicEntity
}