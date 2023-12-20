/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioLabUterinaEntity } from "./criterio_lab_citologia_uterina.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'lab_citologia_uterina' })
export class LabCitologiaUterinaEntity {
    @PrimaryGeneratedColumn('increment')
    labcit_uter_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    labcit_uter_nombre_estandar: string;

    //Relacion UNO a MUCHOS LABORATORIO CITOLOGIA UTERINA (ESTANDARES) - CRITERIOS_LABORATORIO CITOLOGIA UTERINA
    @OneToMany(type => CriterioLabUterinaEntity, cri_lab_uterina => cri_lab_uterina.lab_cit_uterina)
    criterios_lab_uterina: CriterioLabUterinaEntity;

    //RELACION MUCHOS A UNO DE LABORATORIO CITOLOGIAS UTERINAS CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_lab_citologia)
    lab_citologia_estan_servicios: ServicioEntity;

}
