/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioSaludTrabajoEntity } from "./criterios_salud_trabajo.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";


// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_salud_trabajo' })
export class CumplimientoSaludTrabajoEntity {
    @PrimaryGeneratedColumn('increment')
    cump_saltra_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_saltra_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_saltra_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_saltra_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_saltra_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_saltra_fecha_limite: string;
    
    
    @OneToOne(() => CriterioSaludTrabajoEntity)
    @JoinColumn()
    criterio_salud_trabajo: CriterioSaludTrabajoEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-SIC
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_salud_cumplimiento)
    cump_eva_salud: EvaluacionResVerificacionEntity
}