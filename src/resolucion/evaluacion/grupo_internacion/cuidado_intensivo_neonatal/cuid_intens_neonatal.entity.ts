/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioCuidInteNeonatalEntity } from "./criterio_cuid_intens_neonatal.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'cuid_int_neonatal' })
export class CuidInteNeonatalEntity {
    @PrimaryGeneratedColumn('increment')
    cuid_int_neona_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cuid_int_neona_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_INTENSIVO_NEONATAL (ESTANDARES) - CRITERIOS_CUIDADO_BASICO_NEONATAL
    @OneToMany(type => CriterioCuidInteNeonatalEntity, cri_cuid_int_neonatal => cri_cuid_int_neonatal.cuid_int_neonatal)
    criterios_cuid_int_neonatal: CriterioCuidInteNeonatalEntity;

    //RELACION MUCHOS A UNO DE CUIDADO_INTENSIVO_NEONATAL CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_cuidado_intens_neonatal)
    cuidado_intens_neonatal_estan_servicios: ServicioEntity;

}
