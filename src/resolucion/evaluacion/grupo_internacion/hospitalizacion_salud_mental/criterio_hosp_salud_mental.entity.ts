/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HospitalizacionMentalEntity } from "./hosp_salud_mental.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoHospitalizacionMentalEntity } from "./cumplimiento_hosp_salud_mental.entity";



@Entity({ name: 'criterio_hospitalizacion_mental' })
export class CriterioHospitalizacionMentalEntity {
    @PrimaryGeneratedColumn('increment')
    crihosp_ment_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crihosp_ment_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crihosp_ment_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crihosp_ment_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crihosp_ment_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_HOSPITALIZACION_MENTAL - HOSPITALIZACION_MENTAL (ESTANDARES)
    @ManyToOne(type => HospitalizacionMentalEntity,  hospitalizacion_mental=> hospitalizacion_mental.criterios_hospitalizacion_mental)
    hospitalizacion_mental: HospitalizacionMentalEntity;

    //RELACION ONTE TO ONE CRITERIOS HOSPITALIZACION_MENTAL A CUMPLIMIENTO HOSPITALIZACION_MENTAL
    @OneToOne(() => CumplimientoHospitalizacionMentalEntity, cumplimiento => cumplimiento.criterio_hospitalizacion_mental)
    cumplimiento: CumplimientoHospitalizacionMentalEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION_MENTAL - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_hosp_salud_men)
    hosp_salud_men_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION_MENTAL - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_hosp_salud_men)
    hosp_salud_men_aparto: ApartadoEntity;
}