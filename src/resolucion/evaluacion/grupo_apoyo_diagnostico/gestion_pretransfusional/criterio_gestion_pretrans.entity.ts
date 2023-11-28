/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GestionPretransfusionalEntity } from "./gestion_pretrans.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoGestionPretransfusionalEntity } from "./cumplimiento_gestion_pretrans.entity";



@Entity({ name: 'criterio_gest_pretransfusional' })
export class CriterioGestionPretransfusionalEntity {
    @PrimaryGeneratedColumn('increment')
    crigestpre_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crigestpre_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crigestpre_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crigestpre_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crigestpre_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS GESTION PRETANSFUNCIONAL - GESTION PRETANSFUNCIONAL (ESTANDARES)
    @ManyToOne(type => GestionPretransfusionalEntity, gestion_pretransfusional => gestion_pretransfusional.criterios_gest_pretransfusional)
    gestion_pretransfusional: GestionPretransfusionalEntity;

    //RELACION ONTE TO ONE CRITERIOS GESTION PRETANSFUNCIONAL A CUMPLIMIENTO GESTION PRETANSFUNCIONAL
    @OneToOne(() => CumplimientoGestionPretransfusionalEntity, cumplimiento => cumplimiento.criterio_gest_pretransfusional)
    cumplimiento: CumplimientoGestionPretransfusionalEntity;

    //Relacion MUCHOS a UNO CRITERIOS GESTION PRETANSFUNCIONAL - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_pretrans)
    pretrans_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS GESTION PRETANSFUNCIONAL - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_pretrans)
    pretrans_apartado: ApartadoEntity;


}