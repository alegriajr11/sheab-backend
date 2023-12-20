/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioPatologiaEntity } from "./criterio_patologia.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'patologia' })
export class PatologiaEntity {
    @PrimaryGeneratedColumn('increment')
    pato_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    pato_nombre_estandar: string;

    //Relacion UNO a MUCHOS PATOLOGIA (ESTANDARES) - CRITERIOS_PATOLOGIA
    @OneToMany(type => CriterioPatologiaEntity, cri_patologia => cri_patologia.patologia)
    criterios_patologia: CriterioPatologiaEntity;

    //RELACION MUCHOS A UNO DE PATOLOGIA CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_patologia)
    patologia_estan_servicios: ServicioEntity;

}
