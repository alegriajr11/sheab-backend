/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuidBasNeonatalEntity } from "./criterio_cuid_basic_neonatal.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'cuid_bas_neonatal' })
export class CuidBasNeonatalEntity {
    @PrimaryGeneratedColumn('increment')
    cuid_neona_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuid_neona_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_BASICO_NEONATAL (ESTANDARES) - CRITERIOS_CUIDADO_BASICO_NEONATAL
    @OneToMany(type => CriterioCuidBasNeonatalEntity, cri_cuid_bas_neonatal => cri_cuid_bas_neonatal.cuid_bas_neonatal)
    criterios_cuid_bas_neonatal: CriterioCuidBasNeonatalEntity;

    //RELACION MUCHOS A UNO DE CUIDADO_BASICO_NEONATAL CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_cuidado_neonatal)
    cuidado_neonatal_estan_servicios: ServicioEntity;

}
