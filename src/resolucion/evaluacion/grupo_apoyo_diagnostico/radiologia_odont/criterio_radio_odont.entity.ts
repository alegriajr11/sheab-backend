true/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RadiologiaOdontoEntity } from "./radiologia_odont.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoRadOdontologicaEntity } from "./cumplimiento_radio_odont.entity";



@Entity({ name: 'criterio_rad_odontologica' })
export class CriterioRadiologiaOdontoEntity {
    @PrimaryGeneratedColumn('increment')
    crirad_odon_id: number;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crirad_odon_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crirad_odon_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crirad_odon_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crirad_odon_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_RADIOLOGIA_ODONTOLOGICA - RADIOLOGIA_ODONTOLOGICA (ESTANDARES)
    @ManyToOne(type => RadiologiaOdontoEntity, rad_odontologica => rad_odontologica.criterios_rad_odontologica)
    rad_odontologica: RadiologiaOdontoEntity;

    //RELACION ONTE TO ONE CRITERIOS RADIOLOGIA_ODONTOLOGICA A CUMPLIMIENTO RADIOLOGIA_ODONTOLOGICA
    @OneToMany(() => CumplimientoRadOdontologicaEntity, cumplimiento => cumplimiento.criterio_rad_odontologica)
    cumplimiento: CumplimientoRadOdontologicaEntity;

    //Relacion MUCHOS a UNO CRITERIOS RADIOLOGIA_ODONTOLOGICA - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_rad_odonto)
    rad_odonto_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS RADIOLOGIA_ODONTOLOGICA - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_rad_odonto)
    rad_odonto_apartado: ApartadoEntity;


}