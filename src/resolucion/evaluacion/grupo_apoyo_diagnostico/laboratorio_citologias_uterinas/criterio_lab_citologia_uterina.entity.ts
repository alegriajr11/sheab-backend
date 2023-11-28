/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LabCitologiaUterinaEntity } from "./lab_citologia_uterina.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoLabUterinaEntity } from "./cumplimiento_lab_citologia_uterina.entity";



@Entity({ name: 'criterio_lab_uterina' })
export class CriterioLabUterinaEntity {
    @PrimaryGeneratedColumn('increment')
    cri_lab_ute_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_lab_ute_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_lab_ute_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_lab_ute_articulo: string;


    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_lab_ute_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_LAB CITOLOGIA UTERINA - LAB CITOLOGIA UTERINA (ESTANDARES)
    @ManyToOne(type => LabCitologiaUterinaEntity, lab_cit_uterina => lab_cit_uterina.criterios_lab_uterina)
    lab_cit_uterina: LabCitologiaUterinaEntity;

    //RELACION ONTE TO ONE CRITERIOS_IMGIONIZANTES A CUMPLIMIENTO IMGIONIZANTES
    @OneToOne(() => CumplimientoLabUterinaEntity, cumplimiento => cumplimiento.criterio_lab_uterina)
    cumplimiento: CumplimientoLabUterinaEntity;

    //Relacion MUCHOS a UNO CRITERIOS LAB CITOLOGIA UTERINA - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_lab_uterinas)
    lab_uterinas_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS LAB CITOLOGIA UTERINA - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_lab_uterinas)
    lab_uterinas_apartado: ApartadoEntity;
}