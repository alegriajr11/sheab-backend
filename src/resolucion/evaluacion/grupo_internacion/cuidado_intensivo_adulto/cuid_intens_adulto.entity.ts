/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuidIntensAdultoEntity } from "./criterio_cuid_intens_adulto.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'cuid_int_adulto' })
export class CuidIntAdultoEntity {
    @PrimaryGeneratedColumn('increment')
    cuid_int_adult_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuid_int_adult_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_CUIDADO_INTENSIVO_ADULTO (ESTANDARES) - CRITERIOS_CUIDADO_INTENSIVO_ADULTO
    @OneToMany(type => CriterioCuidIntensAdultoEntity, cri_cuid_int_adult => cri_cuid_int_adult.cuid_int_adulto)
    criterios_cuid_int_adulto: CriterioCuidIntensAdultoEntity;

    //RELACION MUCHOS A UNO DE CUIDADO_CUIDADO_INTENSIVO_ADULTO CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_cuidado_intens_adulto)
    cuidado_intens_adulto_estan_servicios: ServicioEntity;

}
