/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ServFarmaceuticoEntity } from "./servicio_farmaceutico.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoSerFarmaceuticoEntity } from "./cumplimiento_s_farmaceutico.entity";



@Entity({ name: 'criterio_ser_farmaceutico' })
export class CriterioSerFarmaceuticoEntity {
    @PrimaryGeneratedColumn('increment')
    criser_farm_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criser_farm_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    criser_farm_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    criser_farm_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    criser_farm_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_SERVICIO_FARMACEUTICO - SERVICIO_FARMACEUTICO (ESTANDARES)
    @ManyToOne(type => ServFarmaceuticoEntity,  ser_farmaceutico=> ser_farmaceutico.criterios_ser_farmaceutico)
    ser_farmaceutico: ServFarmaceuticoEntity;

    //RELACION ONTE TO ONE CRITERIOS SERVICIO_FARMACEUTICO A CUMPLIMIENTO SERVICIO_FARMACEUTICO
    @OneToOne(() => CumplimientoSerFarmaceuticoEntity, cumplimiento => cumplimiento.criterio_ser_farmaceutico)
    cumplimiento: CumplimientoSerFarmaceuticoEntity;

    //Relacion MUCHOS a UNO CRITERIOS SERVICIO_FARMACEUTICO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_serv_farm)
    serv_farm_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS SERVICIO_FARMACEUTICO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_serv_farm)
    serv_farm_apartado: ApartadoEntity;

}