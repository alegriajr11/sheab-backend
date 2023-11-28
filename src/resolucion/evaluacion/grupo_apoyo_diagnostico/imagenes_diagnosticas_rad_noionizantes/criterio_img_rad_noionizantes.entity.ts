/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImgRadNoIonizantesEntity } from "./img_rad_noionizantes.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoImgRadNoIonizanteEntity } from "./cumplimiento_img_rad_noionizantes.entity";



@Entity({ name: 'criterio_img_noionizante' })
export class CriterioImgRadNoIonizantesEntity {
    @PrimaryGeneratedColumn('increment')
    cri_img_noioni_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_img_noioni_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_img_noioni_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_img_noioni_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_img_noioni_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_IMGNOIONIZANTES - IMGNOIONIZANTES (ESTANDARES)
    @ManyToOne(type => ImgRadNoIonizantesEntity, img_noionizante => img_noionizante.criterios_img_noionizantes)
    imgrad_noionizante: ImgRadNoIonizantesEntity;

    //RELACION ONTE TO ONE CRITERIOS_IMGIONIZANTES A CUMPLIMIENTO IMGIONIZANTES
    @OneToOne(() => CumplimientoImgRadNoIonizanteEntity, cumplimiento => cumplimiento.criterio_img_rad_noion)
    cumplimiento: CumplimientoImgRadNoIonizanteEntity;

    //Relacion MUCHOS a UNO CRITERIOS IMGNOIONIZANTES - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_noionizante)
    noionizante_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS IMGNOIONIZANTES - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_noionizante)
    noionizante_apartado: ApartadoEntity;

}