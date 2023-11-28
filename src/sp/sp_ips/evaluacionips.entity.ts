/* eslint-disable prettier/prettier */
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CriterioAjusteEntity } from "./criterioajuste.entity";
import { CriterioImplementacionEntity } from "./criterioimplementacion.entity";
import { CriterioPlaneacionEntity } from "./criterioplaneacion.entity";
import { CriterioVerificacionEntity } from "./criterioverificacion.entity";
import { ItemEntity } from "./item.entity";
import { ActaSpIpsEntity } from "src/generarpdf/sp/sp-ips/sp-ips.entity";
import { EvaluacionipsCreadasEntity } from "./evaluacion_ips_creada.entity";

@Entity({ name: 'evaluacionips' })
export class EvaluacionipsEntity {
    @PrimaryGeneratedColumn('increment')
    evips_id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: false })
    evips_nombre: string;


    @ManyToMany(type => ItemEntity, item => item.ite_evaluacionips, { eager: true })
    @JoinTable({
        name: 'ite_eva',
        joinColumn: { name: 'ite_eva_id' },
        inverseJoinColumn: { name: 'eva_ite_id' }
    })
    evips_items: ItemEntity[];

    //Relacion Uno a Muchos EVALUACIONIPS - CRITERIO_AJUSTE
    @OneToMany(type => CriterioAjusteEntity, evaluacionips => evaluacionips.cri_aju_eva)
    evaluacionipsAjuste: CriterioAjusteEntity

    //Relacion Uno a Muchos EVALUACIONIPS - CRITERIO_IMPLEMENTACION
    @OneToMany(type => CriterioImplementacionEntity, evaluacionips => evaluacionips.cri_imp_eva)
    evaluacionipsImpl: CriterioImplementacionEntity

    //Relacion Uno a Muchos EVALUACIONIPS - CRITERIO_VERIFICACION
    @OneToMany(type => CriterioVerificacionEntity, evaluacionips => evaluacionips.cri_ver_eva)
    evaluacionipsVerif: CriterioVerificacionEntity

    //Relacion Uno a Muchos EVALUACIONIPS - CRITERIO_PLANEACION
    @OneToMany(type => CriterioPlaneacionEntity, evaluacionips => evaluacionips.cri_pla_eva)
    evaluacionipsPlane: CriterioPlaneacionEntity


    //Relacion Muchos a Muchos ROL - USUARIOS
    @ManyToMany(type => ActaSpIpsEntity, acta_ips => acta_ips.evaluacionesips)
    actas_ips: ActaSpIpsEntity[];
}