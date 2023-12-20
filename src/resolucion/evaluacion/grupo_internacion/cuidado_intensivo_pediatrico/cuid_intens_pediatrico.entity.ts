/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuidIntePediatricoEntity } from "./criterio_cuid_intens_pediatrico.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'cuid_int_pediatrico' })
export class CuidIntePediatricoEntity {
    @PrimaryGeneratedColumn('increment')
    cuid_int_pedi_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuid_int_pedi_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_INTENSIVO_PEDIATRICO (ESTANDARES) - CRITERIOS_CUIDADO_INTENSIVO_PEDIATRICO
    @OneToMany(type => CriterioCuidIntePediatricoEntity, cri_cuid_int_pediatrico => cri_cuid_int_pediatrico.cuid_int_pediatrico)
    criterios_cuid_int_pediatrico: CriterioCuidIntePediatricoEntity;

    //RELACION MUCHOS A UNO DE CUIDADO_INTENSIVO_PEDIATRICO CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_cuidado_intens_pediatrico)
    cuidado_intens_pediatrico_estan_servicios: ServicioEntity;

}
