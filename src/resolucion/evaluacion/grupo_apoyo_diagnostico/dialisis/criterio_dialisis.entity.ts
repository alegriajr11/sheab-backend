/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DialisisEntity } from "./dialisis.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoDialisisEntity } from "./cumplimiento_dialisis.entity";



@Entity({ name: 'criterio_dialisis' })
export class CriterioDialisisEntity {
    @PrimaryGeneratedColumn('increment')
    cridial_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cridial_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cridial_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cridial_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cridial_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_DIALISIS - DIALISIS (ESTANDARES)
    @ManyToOne(type => DialisisEntity, dialisis => dialisis.criterios_dialisis)
    dialisis: DialisisEntity;

    //RELACION ONTE TO ONE CRITERIOS_DIALISIS A CUMPLIMIENTO DIALISIS
    @OneToOne(() => CumplimientoDialisisEntity, cumplimiento => cumplimiento.criterio_dialisis)
    cumplimiento: CumplimientoDialisisEntity;

    //Relacion MUCHOS a UNO CRITERIOS_DIALISIS - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_dial)
    dial_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS_DIALISIS - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_dial)
    dial_apartado: ApartadoEntity;


}