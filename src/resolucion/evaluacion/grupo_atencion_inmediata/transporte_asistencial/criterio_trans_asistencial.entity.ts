/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TranspAsistencialEntity } from "./transporte_asistencial.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoTranspAsistencialEntity } from "./cumplimiento_trans_asistencial.entity";



@Entity({ name: 'criterio_trans_asistencial' })
export class CriterioTranspAsistencialEntity {
    @PrimaryGeneratedColumn('increment')
    cri_trans_asis_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_trans_asis_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_trans_asis_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_trans_asis_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_trans_asis_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_TRANSPORTE_ASISTENCIAL - TRANSPORTE_ASISTENCIAL (ESTANDARES)
    @ManyToOne(type => TranspAsistencialEntity,  transp_asistencial=> transp_asistencial.criterios_transp_asistencial)
    transp_asistencial: TranspAsistencialEntity;

    //RELACION ONTE TO ONE CRITERIOS TRANSPORTE_ASISTENCIAL A CUMPLIMIENTO TRANSPORTE_ASISTENCIAL
    @OneToOne(() => CumplimientoTranspAsistencialEntity, cumplimiento => cumplimiento.criterio_transp_asistencial)
    cumplimiento: CumplimientoTranspAsistencialEntity;

    //Relacion MUCHOS a UNO CRITERIOS TRANSPORTE_ASISTENCIAL- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_trans_asis)
    trans_asis_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS TRANSPORTE_ASISTENCIAL- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_trans_asis)
    trans_asis_apartado: ApartadoEntity;
}