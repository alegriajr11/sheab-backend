/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioLabUterinaEntity } from "./criterio_lab_citologia_uterina.entity";





@Entity({ name: 'lab_citologia_uterina' })
export class LabCitologiaUterinaEntity {
    @PrimaryGeneratedColumn('increment')
    labcit_uter_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    labcit_uter_nombre_estandar: string;

    //Relacion UNO a MUCHOS LABORATORIO CITOLOGIA UTERINA (ESTANDARES) - CRITERIOS_LABORATORIO CITOLOGIA UTERINA
    @OneToMany(type => CriterioLabUterinaEntity, cri_lab_uterina => cri_lab_uterina.lab_cit_uterina)
    criterios_lab_uterina: CriterioLabUterinaEntity;

    //Relación MUCHOS a UNO LAB_CITOLOGIA UTERINA - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.lab_uterina)
    // prestador: PrestadorEntity

}
