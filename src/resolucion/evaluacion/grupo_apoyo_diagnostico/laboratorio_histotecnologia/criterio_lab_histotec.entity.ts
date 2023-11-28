/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LabHistotecnologiaEntity } from "./lab_histotecnologia.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoLabHistotecnEntity } from "./cumplimiento_lab_histotec.entity";



@Entity({ name: 'criterio_lab_histotecnologia' })
export class CriterioLabHistotecnologiaEntity {
    @PrimaryGeneratedColumn('increment')
    cri_lab_histo_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_lab_histo_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_lab_histo_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_lab_histo_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_lab_histo_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_LAB_HISTOTECNOLOGIA- LABORATORIO_HISTOTECNOLOGIA (ESTANDARES)
    @ManyToOne(type => LabHistotecnologiaEntity, lab_histotecnologia => lab_histotecnologia.criterios_lab_histotecnologia)
    lab_histotecnologia: LabHistotecnologiaEntity;

    //RELACION ONTE TO ONE CRITERIOS LABORATORIO_HISTOTECNOLOGIA A CUMPLIMIENTO LABORATORIO_HISTOTECNOLOGIA
    @OneToOne(() => CumplimientoLabHistotecnEntity, cumplimiento => cumplimiento.criterio_lab_histotecnologia)
    cumplimiento: CumplimientoLabHistotecnEntity;

    //Relacion MUCHOS a UNO CRITERIOS LABORATORIO_HISTOTECNOLOGIA- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_lab_histotec)
    lab_histotec_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS LABORATORIO_HISTOTECNOLOGIA- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_lab_histotec)
    lab_histotec_apartado: ApartadoEntity;

}