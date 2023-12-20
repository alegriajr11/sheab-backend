/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuidIntermPediatricoEntity } from "./criterio_cuid_inter_pediatrico.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'cuid_interm_pediatrico' })
export class CuidIntermPediatricoEntity {
    @PrimaryGeneratedColumn('increment')
    cuid_inter_pedi_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuid_inter_pedi_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_CUIDADO_INTERMEDIO_PEDIATRICO (ESTANDARES) - CRITERIOS_CUIDADO_INTERMEDIO_PEDIATRICO
    @OneToMany(type => CriterioCuidIntermPediatricoEntity, cri_cuid_inter_pediatrico=> cri_cuid_inter_pediatrico.cuid_inter_pediatrico)
    criterios_cuid_inter_pediatrico: CriterioCuidIntermPediatricoEntity;
    
    //RELACION MUCHOS A UNO DE CUIDADO_CUIDADO_INTERMEDIO_PEDIATRICO CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_cuidado_inter_pediatrico)
    cuidado_inter_pediatrico_estan_servicios: ServicioEntity;
}
