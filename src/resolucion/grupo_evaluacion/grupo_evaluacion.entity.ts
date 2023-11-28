import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable, OneToOne, OneToMany } from 'typeorm';
import { ServicioEntity } from '../servicio/servicio.entity';
import { ServiciosVerificadosEntity } from '../servicios_capacidad/servicios_verificados.entity';

@Entity({ name: 'grupo-evaluacion' })
export class GrupoEvaluacionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 60, nullable: false })
    nombre: string

    @OneToMany(() => ServicioEntity, servicios => servicios.evaluacion_servicios)
    servicios_evaluacion: ServicioEntity;

    //Relacion UNO a MUCHOS GRUPO EVALUACION - SERVICIOS VERIFICADOS
    @OneToMany(type => ServiciosVerificadosEntity, ser_veri => ser_veri.grup_evaluacion)
    seriv_verif_grup_eval: ServiciosVerificadosEntity;

}