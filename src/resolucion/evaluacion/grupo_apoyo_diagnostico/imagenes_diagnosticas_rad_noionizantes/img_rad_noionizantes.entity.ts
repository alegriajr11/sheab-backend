/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioImgRadNoIonizantesEntity } from "./criterio_img_rad_noionizantes.entity";





@Entity({ name: 'img_rad_noionizantes' })
export class ImgRadNoIonizantesEntity {
    @PrimaryGeneratedColumn('increment')
    imgrad_noion_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    imgrad_noion_nombre_estandar: string;

    //Relacion UNO a MUCHOS IMAGENES DIAGNOSTICAS RAD_NoIONIZANTES (ESTANDARES) - CRITERIOS_IMAGENES DIAGNOSTICAS RAD_IONIZANTES
    @OneToMany(type => CriterioImgRadNoIonizantesEntity, cri_img_noionizantes => cri_img_noionizantes.imgrad_noionizante)
    criterios_img_noionizantes: CriterioImgRadNoIonizantesEntity;

    //Relación MUCHOS a UNO IMAGENES DIAGNOSTICAS RAD_IONIZANTES - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.img_ionizantes)
    // prestador: PrestadorEntity

}
