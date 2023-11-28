import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CumplimientoHabilitacionEntity } from "./cumplimiento_habilitacion.entity";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { ActaVerificacionEntity } from "src/generarpdf/resolucion/verificacion/acta-verificacion.entity";



@Entity({ name: 'concepto_3100_codiciones' })
export class ConceptoResEntity {
    @PrimaryGeneratedColumn('increment')
    conc_id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: false })
    conc_nombre: string;

    //Relacion UNO a MUCHOS CONCEPTORES - CUMPLIMIENTOHAB_RES
    @OneToMany(type => CumplimientoHabilitacionEntity, cumplimientohab => cumplimientohab.conceptos_res)
    cumplimientohab: CumplimientoHabilitacionEntity;


    @ManyToMany(type => ActaVerificacionEntity, acta_verificacion => acta_verificacion.acta_verificacion_concepto3100, { eager: true })
    @JoinTable({
        name: 'concept_acta_verificacion',
        joinColumn: { name: 'conc_acta_id' },
        inverseJoinColumn: { name: 'acta_conc_id' }
    })
    concepto3100_acta_verificacion: ActaVerificacionEntity[];
}