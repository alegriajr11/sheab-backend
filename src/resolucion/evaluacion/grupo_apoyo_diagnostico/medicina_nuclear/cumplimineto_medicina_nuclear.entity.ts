/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioMedicinaNuclearEntity } from "./criterio_medicina_nuclear.entity";
import { EvaluacionResVerificacionEntity } from "../../evaluacion_resolucion_verificacion/evaluacion_res.entity";



// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'cumplimiento_med_nuclear' })
export class CumplimientoMedNuclearEntity {
    @PrimaryGeneratedColumn('increment')
    cump_med_nucl_id: number;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    cump_med_nucl_cumple: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_med_nucl_hallazgo: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: false })
    cump_med_nucl_accion: string;

    @Column({ type: 'varchar', length: 200, nullable: false, unique: false })
    cump_med_nucl_responsable: string;

    @Column({ type: 'date', nullable: false, unique: false })
    cump_med_nucl_fecha_limite: string;
    

    @OneToOne(() => CriterioMedicinaNuclearEntity)
    @JoinColumn()
    criterio_med_nuclear: CriterioMedicinaNuclearEntity

    //Relacion Muchos a CUMPLIMIENTO - EVALUACION-RES
    @ManyToOne(type => EvaluacionResVerificacionEntity, eva_res => eva_res.eva_cumplimiento_med_nuclear)
    cump_eva_med_nuclear: EvaluacionResVerificacionEntity

}