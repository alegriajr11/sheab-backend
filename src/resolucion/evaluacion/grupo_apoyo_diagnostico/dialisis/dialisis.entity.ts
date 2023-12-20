/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioDialisisEntity } from "./criterio_dialisis.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'dialisis' })
export class DialisisEntity {
    @PrimaryGeneratedColumn('increment')
    dial_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    dial_nombre_estandar: string;

    //Relacion UNO a MUCHOS VACUNACIÓN (ESTANDARES) - CRITERIOS_VACUNACIÓN
    @OneToMany(type => CriterioDialisisEntity, cri_dialisis => cri_dialisis.dialisis)
    criterios_dialisis: CriterioDialisisEntity;

    //RELACION MUCHOS A UNO DE DIALISIS CON SERVICIOS 
    @ManyToOne(type => ServicioEntity,  servicio=>  servicio.servicios_dial)
    dial_estan_servicios: ServicioEntity;

}
