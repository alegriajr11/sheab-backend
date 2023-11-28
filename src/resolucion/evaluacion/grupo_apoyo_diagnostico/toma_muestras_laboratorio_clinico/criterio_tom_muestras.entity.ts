/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MuestrasLabClinicoEntity } from "./tom_muestras.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoMuestLabClinicoEntity } from "./cumplimiento_tom_muestras.entity";



@Entity({ name: 'criterio_muestra_lab_clinico' })
export class CriterioMuestraLabClinicoEntity {
    @PrimaryGeneratedColumn('increment')
    cri_muest_cli_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_muest_cli_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_muest_cli_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_muest_cli_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_muest_cli_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_TOMA_MUESTRAS_LABORATORIO_CLINICO - TOMA_MUESTRAS_LABORATORIO_CLINICO (ESTANDARES)
    @ManyToOne(type => MuestrasLabClinicoEntity, tom_mue_lab_clinico => tom_mue_lab_clinico.criterios_muest_lab_clinico)
    tom_mue_lab_clinico: MuestrasLabClinicoEntity;

    //RELACION ONTE TO ONE CRITERIOS TOMA_MUESTRAS_LABORATORIO_CLINICO A CUMPLIMIENTO TOMA_MUESTRAS_LABORATORIO_CLINICO
    @OneToOne(() => CumplimientoMuestLabClinicoEntity, cumplimiento => cumplimiento.criterio_muest_lab_clinico)
    cumplimiento: CumplimientoMuestLabClinicoEntity;

    //Relacion MUCHOS a UNO CRITERIOS TOMA_MUESTRAS_LABORATORIO_CLINICO- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_tom_lab_clinico)
    tom_lab_clinico_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS TOMA_MUESTRAS_LABORATORIO_CLINICO- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_tom_lab_clinico)
    tom_lab_clinico_apartado: ApartadoEntity;


}