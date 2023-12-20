/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioDiagnostVascularEntity } from "./criterio_diagnost_vascular.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'diagnostico_vascular' })
export class DiagnosticoVascularEntity {
    @PrimaryGeneratedColumn('increment')
    diag_vas_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    diag_vas_nombre_estandar: string;

    //Relacion UNO a MUCHOS VACUNACIÓN (ESTANDARES) - CRITERIOS_DIAGNOSTICO_VASCULAR
    @OneToMany(type => CriterioDiagnostVascularEntity, cri_diag_vascular => cri_diag_vascular.diagnostico_vascular)
    criterios_diag_vascular: CriterioDiagnostVascularEntity;

    //RELACION MUCHOS A UNO DE DIAGNOSTICO VASCULAR CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_diag)
    diag_estan_servicios: ServicioEntity;

}
