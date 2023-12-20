/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioImgRadIonizantesEntity } from "./criterio_img_rad_ionizantes.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'img_rad_ionizantes' })
export class ImgRadIonizantesEntity {
    @PrimaryGeneratedColumn('increment')
    imgradion_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    imgradion_nombre_estandar: string;

    //Relacion UNO a MUCHOS IMAGENES DIAGNOSTICAS RAD_IONIZANTES (ESTANDARES) - CRITERIOS_IMAGENES DIAGNOSTICAS RAD_IONIZANTES
    @OneToMany(type => CriterioImgRadIonizantesEntity, cri_img_ionizantes => cri_img_ionizantes.imgrad_ionizante)
    criterios_img_ionizantes: CriterioImgRadIonizantesEntity;

    //RELACION MUCHOS A UNO DE IMAGENES DIAGNOSTICAS IONIZANTES CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_imag_ionizante)
    imag_ionizante_estan_servicios: ServicioEntity;

}
