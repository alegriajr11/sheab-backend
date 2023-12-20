/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuidIntermAdultoEntity } from "./criterio_cuid_inter_adulto.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'cuid_interm_adulto' })
export class CuidIntermAdultoEntity {
    @PrimaryGeneratedColumn('increment')
    cuid_inter_adult_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuid_inter_adult_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_CUIDADO_INTERMEDIO_ADULTO (ESTANDARES) - CRITERIOS_CUIDADO_INTERMEDIO_ADULTO
    @OneToMany(type => CriterioCuidIntermAdultoEntity, cri_cuid_inter_adulto=> cri_cuid_inter_adulto.cuid_inter_adulto)
    criterios_cuid_inter_adulto: CriterioCuidIntermAdultoEntity;

    //RELACION MUCHOS A UNO DE CUIDADO_CUIDADO_INTERMEDIO_ADULTO CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_cuidado_inter_adulto)
    cuidado_inter_adulto_estan_servicios: ServicioEntity;

}
