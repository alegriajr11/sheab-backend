/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioImgRadIonizantesEntity } from "./criterio_img_rad_ionizantes.entity";





@Entity({ name: 'img_rad_ionizantes' })
export class ImgRadIonizantesEntity {
    @PrimaryGeneratedColumn('increment')
    imgradion_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    imgradion_nombre_estandar: string;

    //Relacion UNO a MUCHOS IMAGENES DIAGNOSTICAS RAD_IONIZANTES (ESTANDARES) - CRITERIOS_IMAGENES DIAGNOSTICAS RAD_IONIZANTES
    @OneToMany(type => CriterioImgRadIonizantesEntity, cri_img_ionizantes => cri_img_ionizantes.imgrad_ionizante)
    criterios_img_ionizantes: CriterioImgRadIonizantesEntity;

    //Relación MUCHOS a UNO IMAGENES DIAGNOSTICAS RAD_IONIZANTES - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.img_ionizantes)
    // prestador: PrestadorEntity

}
