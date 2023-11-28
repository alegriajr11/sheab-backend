true/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PrehospitalariaEntity } from "./prehospitalaria.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoPrehospitalariaEntity } from "./cumplimiento_prehospitalaria.entity";



@Entity({ name: 'criterio_prehospitalaria' })
export class CriterioPrehospitalariaEntity {
    @PrimaryGeneratedColumn('increment')
    cripreh_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cripreh_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cripreh_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cripreh_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cripreh_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_PREHOSPITALARIA - PREHOSPITALARIA (ESTANDARES)
    @ManyToOne(type => PrehospitalariaEntity,  prehospitalaria=> prehospitalaria.criterios_prehospitalaria)
    prehospitalaria: PrehospitalariaEntity;

    //RELACION ONTE TO ONE CRITERIOS PREHOSPITALARIA A CUMPLIMIENTO PREHOSPITALARIA
    @OneToOne(() => CumplimientoPrehospitalariaEntity, cumplimiento => cumplimiento.criterio_prehospitalaria)
    cumplimiento: CumplimientoPrehospitalariaEntity;

    //Relacion MUCHOS a UNO CRITERIOS PREHOSPITALARIA- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_prehospi)
    prehospi_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS PREHOSPITALARIA- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_prehospi)
    prehospi_apartado: ApartadoEntity;


}