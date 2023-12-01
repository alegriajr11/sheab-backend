import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EvaluacionSicEntity } from "../evaluacionsic.entity";

@Entity({ name: 'div_creado_sic' })
export class DivCreadoSicEntity {
    @PrimaryGeneratedColumn('increment')
    div_id: number;

    @Column({ type: 'int' })
    div_numero_clones: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    div_dominio: string;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: false })
    div_indicador: string;

    @Column({ type: 'int' })
    div_id_dominio: number;

    @Column({ type: 'int' })
    div_id_indicador: number;

    //Relacion UNO a MUCHOS CRITERIOS SIC - CUMPLIMIENTOSIC
    @ManyToOne(type => EvaluacionSicEntity, evaluacion_sic => evaluacion_sic.evaluacion_divs_creados)
    div_creado: EvaluacionSicEntity;

}
