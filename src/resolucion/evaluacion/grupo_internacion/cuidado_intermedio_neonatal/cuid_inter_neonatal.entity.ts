/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuidIntermNeonatalEntity } from "./criterio_cuid_inter_neonatal.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'cuid_interm_neonatal' })
export class CuidIntermNeonatalEntity {
    @PrimaryGeneratedColumn('increment')
    cuid_inter_adult_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuid_inter_adult_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_CUIDADO_INTERMEDIO_NEONATAL (ESTANDARES) - CRITERIOS_CUIDADO_INTERMEDIO_NEONATAL
    @OneToMany(type => CriterioCuidIntermNeonatalEntity, cri_cuid_inter_neonatal=> cri_cuid_inter_neonatal.cuid_inter_neonatal)
    criterios_cuid_inter_neonatal: CriterioCuidIntermNeonatalEntity;

    //RELACION MUCHOS A UNO DE CUIDADO_CUIDADO_INTERMEDIO_NEONATAL CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_cuidado_inter_neonatal)
    cuidado_inter_neonatal_estan_servicios: ServicioEntity;

}
