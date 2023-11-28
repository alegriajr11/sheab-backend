/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LabClinicoEntity } from "./laboratorio_clinico.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoLabClinicoEntity } from "./cumplimiento_lab_clinico.entity";



@Entity({ name: 'criterio_lab_clinico' })
export class CriterioLabClinicoEntity {
    @PrimaryGeneratedColumn('increment')
    cri_lab_cli_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_lab_cli_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_lab_cli_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_lab_cli_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_lab_cli_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_LAB_CLINICO - LABORATORIO CLINICO (ESTANDARES)
    @ManyToOne(type => LabClinicoEntity, lab_clinico => lab_clinico.criterios_lab_clinico)
    lab_clinico: LabClinicoEntity;

    //RELACION ONTE TO ONE CRITERIOS LABORATORIO CLINICO A CUMPLIMIENTO LABORATORIO CLINICO
    @OneToOne(() => CumplimientoLabClinicoEntity, cumplimiento => cumplimiento.criterio_lab_clinico)
    cumplimiento: CumplimientoLabClinicoEntity;

    //Relacion MUCHOS a UNO CRITERIOS LAB CLINICO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_lab_clinico)
    lab_clinico_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS LAB CLINICO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_lab_clinico)
    lab_clinico_apartado: ApartadoEntity;

}