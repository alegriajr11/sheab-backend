import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ConceptoResEntity } from "./concepto_res.entity";


@Entity({ name: 'cumplimiento_habilitacion' })
export class CumplimientoHabilitacionEntity {
    @PrimaryGeneratedColumn('increment')
    cumpl_id: number;

    @Column({ type: 'varchar', length: 11, nullable: false, unique: false })
    cumpl_estado: string;


    //Relacion Muchos a Uno CONCEPTO - REQUISITOS
    @ManyToOne(type => ConceptoResEntity, conceptoRes => conceptoRes.cumplimientohab)
    conceptos_res: ConceptoResEntity;

    


}