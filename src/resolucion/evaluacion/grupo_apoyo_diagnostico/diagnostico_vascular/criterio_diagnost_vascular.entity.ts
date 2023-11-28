true/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DiagnosticoVascularEntity } from "./diagnostico_vascular.entity";
import { CumplimientoDiagnosticoVascularEntity } from "./cumplimiento_diagnost_vascular.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";



@Entity({ name: 'criterio_diagnost_vascular' })
export class CriterioDiagnostVascularEntity {
    @PrimaryGeneratedColumn('increment')
    crivac_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cridiagv_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cridiagv_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cridiagv_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cridiagv_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_DIAGNOSTICO_VASCULAR - DIAGNOSTICO_VASCULAR (ESTANDARES)
    @ManyToOne(type => DiagnosticoVascularEntity,  diagnostico_vascular=> diagnostico_vascular.criterios_diag_vascular)
    diagnostico_vascular: DiagnosticoVascularEntity;

    //RELACION ONTE TO ONE criterio_diagnost_vascular A cumplimiento_diagnostico_vascular
    @OneToMany(() => CumplimientoDiagnosticoVascularEntity, cumplimiento => cumplimiento.criterio_diag_vascular)
    cumplimiento: CumplimientoDiagnosticoVascularEntity;

    //Relacion MUCHOS a UNO CRITERIOS_DIAGNOSTICO_VASCULAR - SECCION
    @ManyToOne(type => SeccionEntity,  seccion=> seccion.seccion_diag_vas)
    diag_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS_DIAGNOSTICO_VASCULAR - APARTADO
    @ManyToOne(type => ApartadoEntity,  apartado=> apartado.apartado_diag_vas)
    diag_apartado: ApartadoEntity;
}