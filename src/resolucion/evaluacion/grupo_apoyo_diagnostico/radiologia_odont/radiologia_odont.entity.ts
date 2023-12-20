/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioRadiologiaOdontoEntity } from "./criterio_radio_odont.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'radiologia_odonto' })
export class RadiologiaOdontoEntity {
    @PrimaryGeneratedColumn('increment')
    rad_odont_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    rad_odont_nombre_estandar: string;

    //Relacion UNO a MUCHOS RADIOLOGIA_ODONTOLOGICA (ESTANDARES) - CRITERIOS_RADIOLOGIA_ODONTOLOGICA
    @OneToMany(type => CriterioRadiologiaOdontoEntity, cri_rad_odontologica => cri_rad_odontologica.rad_odontologica)
    criterios_rad_odontologica: CriterioRadiologiaOdontoEntity;

    //RELACION MUCHOS A UNO DE RADIOLOGIA ODONTOLOGICA CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_odontologica)
    odontologica_estan_servicios: ServicioEntity;

}
