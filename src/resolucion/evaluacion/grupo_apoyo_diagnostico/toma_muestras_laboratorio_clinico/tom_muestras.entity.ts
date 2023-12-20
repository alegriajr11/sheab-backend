/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioMuestraLabClinicoEntity } from "./criterio_tom_muestras.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'muestras_lab_clinico' })
export class MuestrasLabClinicoEntity {
    @PrimaryGeneratedColumn('increment')
    mue_lab_cli_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    mue_lab_cli_nombre_estandar: string;

    //Relacion UNO a MUCHOS TOMA_MUESTRAS_LABORATORIO_CLINICO (ESTANDARES) - CRITERIOS_TOMA_MUESTRAS_LABORATORIO_CLINICO
    @OneToMany(type => CriterioMuestraLabClinicoEntity, cri_muest_lab_clinico => cri_muest_lab_clinico.tom_mue_lab_clinico)
    criterios_muest_lab_clinico: CriterioMuestraLabClinicoEntity;

    //RELACION MUCHOS A UNO DE TOMA_MUESTRAS_LABORATORIO_CLINICO CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_toma_lab_clinico)
    toma_lab_clinico_estan_servicios: ServicioEntity;

}
