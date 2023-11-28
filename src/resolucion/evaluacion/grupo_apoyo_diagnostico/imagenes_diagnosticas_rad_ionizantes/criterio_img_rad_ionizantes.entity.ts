/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImgRadIonizantesEntity } from "./img_rad_ionizantes.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoImgRadIonizanteEntity } from "./cumplimiento_img_rad_ionizantes.entity";



@Entity({ name: 'criterio_img_ionizante' })
export class CriterioImgRadIonizantesEntity {
    @PrimaryGeneratedColumn('increment')
    cri_imgioni_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_imgioni_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_imgioni_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_imgioni_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_imgioni_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_IMGIONIZANTES - IMGIONIZANTES (ESTANDARES)
    @ManyToOne(type => ImgRadIonizantesEntity, img_ionizante => img_ionizante.criterios_img_ionizantes)
    imgrad_ionizante: ImgRadIonizantesEntity;

    //RELACION ONTE TO ONE CRITERIOS_IMGIONIZANTES A CUMPLIMIENTO IMGIONIZANTES
    @OneToOne(() => CumplimientoImgRadIonizanteEntity, cumplimiento => cumplimiento.criterio_img_rad_ion)
    cumplimiento: CumplimientoImgRadIonizanteEntity;

    //Relacion MUCHOS a UNO CRITERIOS GESTION IMGIONIZANTES - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_ionizante)
    ionizante_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS GESTION IMGIONIZANTES - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_ionizante)
    ionizante_apartado: ApartadoEntity;
}