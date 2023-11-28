/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HermodIntervenEntity } from "./hemod_interven.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoHermoIntervenEntity } from "./cumplimiento_hemo_inter.entity";



@Entity({ name: 'criterio_hermo_interven' })
export class CriterioHermoIntervenEntity {
    @PrimaryGeneratedColumn('increment')
    criherminte_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criherminte_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criherminte_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    criherminte_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    criherminte_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS HEMODINAMINA INTERVENCION - HEMODINAMINA INTERVENCION (ESTANDARES)
    @ManyToOne(type => HermodIntervenEntity, hermo_interven => hermo_interven.criterios_hermod_interven)
    hermod_interven: HermodIntervenEntity;


    //RELACION ONTE TO ONE CRITERIOS HEMODINAMINA INTERVENCION A CUMPLIMIENTO HEMODINAMINA INTERVENCION
    @OneToOne(() => CumplimientoHermoIntervenEntity, cumplimiento => cumplimiento.criterio_hermo_interven)
    cumplimiento: CumplimientoHermoIntervenEntity;

    //Relacion MUCHOS a UNO CRITERIOS HEMODINAMINA INTERVENCION - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_hermo_inver)
    hermo_inver_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS HEMODINAMINA INTERVENCION- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_hermo_inver)
    hermo_inver_apartado: ApartadoEntity;
}