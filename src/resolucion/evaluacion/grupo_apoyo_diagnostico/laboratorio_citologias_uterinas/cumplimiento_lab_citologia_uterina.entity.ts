/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioLabUterinaEntity } from "./criterio_lab_citologia_uterina.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_lab_uterina' })
export class CumplimientoLabUterinaEntity {
    @PrimaryGeneratedColumn('increment')
    cump_labuter_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_labuter_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_labuter_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_labuter_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_labuter_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_labuter_fecha_limite: string;



    @OneToOne(() => CriterioLabUterinaEntity)
    @JoinColumn()
    criterio_lab_uterina: CriterioLabUterinaEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_cito_uter)
    cump_eva_cito_uter: EvaluacionResVerificacionEntity

}