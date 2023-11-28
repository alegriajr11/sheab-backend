/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PartoEntity } from "./parto.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoPartoEntity } from "./cumplimiento_parto.entity";



@Entity({ name: 'criterio_parto' })
export class CriterioPartoEntity {
    @PrimaryGeneratedColumn('increment')
    criparto_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criparto_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criparto_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    criparto_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    criparto_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_PARTO - PARTO (ESTANDARES)
    @ManyToOne(type => PartoEntity,  parto=> parto.criterios_parto)
    parto: PartoEntity;

    //RELACION ONTE TO ONE CRITERIOS PARTO A CUMPLIMIENTO PARTO
    @OneToOne(() => CumplimientoPartoEntity, cumplimiento => cumplimiento.criterio_parto)
    cumplimiento: CumplimientoPartoEntity;

    //Relacion MUCHOS a UNO CRITERIOS PARTO- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_parto)
    parto_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS PARTO- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_parto)
    parto_apartado: ApartadoEntity;


}