/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HospitalizacionCronicoEntity } from "./hospi_paciente_cronico.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoHospitCronicoEntity } from "./cumplimiento_hosp_paciente_cron.entity";



@Entity({ name: 'criterio_hospitalizacion_cronico' })
export class CriterioHospitCronicoEntity {
    @PrimaryGeneratedColumn('increment')
    crihosp_cron_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crihosp_cron_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crihosp_cron_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crihosp_cron_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crihosp_cron_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_HOSPITALIZACION_CRONICO - HOSPITALIZACION_CRONICO (ESTANDARES)
    @ManyToOne(type => HospitalizacionCronicoEntity,  hospitalizacion_cronico=> hospitalizacion_cronico.criterios_hospit_cronico)
    hospit_cronico: HospitalizacionCronicoEntity;

    //RELACION ONTE TO ONE CRITERIOS HOSPITALIZACION_CRONICO A CUMPLIMIENTO HOSPITALIZACION_CRONICO
    @OneToOne(() => CumplimientoHospitCronicoEntity, cumplimiento => cumplimiento.criterio_hospit_cronico)
    cumplimiento: CumplimientoHospitCronicoEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION_CRONICO - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_hosp_paciente_cro)
    hosp_paciente_cro_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS  HOSPITALIZACION_CRONICO - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_hosp_paciente_cro)
    hosp_paciente_cro_aparto: ApartadoEntity;
}