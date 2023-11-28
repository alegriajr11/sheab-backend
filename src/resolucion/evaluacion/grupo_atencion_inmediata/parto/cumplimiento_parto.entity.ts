/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioPartoEntity } from "./criterio_parto.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_parto' })
export class CumplimientoPartoEntity {
    @PrimaryGeneratedColumn('increment')
    cump_parto_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_parto_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_parto_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_parto_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_parto_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_parto_fecha_limite: string;

    

    @OneToOne(() => CriterioPartoEntity)
    @JoinColumn()
    criterio_parto: CriterioPartoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_parto)
    cump_eva_parto: EvaluacionResVerificacionEntity

}