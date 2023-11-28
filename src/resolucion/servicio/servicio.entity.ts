import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { GrupoEvaluacionEntity } from '../grupo_evaluacion/grupo_evaluacion.entity';

@Entity({ name: 'servicios' })
export class ServicioEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 105, nullable: false})
    nombre: string;

    // RELACION UNO A UNO ACTA VERIFICACION - DATOS VCERIFICADOS ENCONTRADOS
    // @ManyToOne(() => GrupoEvaluacionEntity, evaluacion => evaluacion.servicios_evaluacion)
    // @JoinColumn()
    // evaluacion_servicios: GrupoEvaluacionEntity;
    
    @ManyToOne(type => GrupoEvaluacionEntity,  evaluacion=>  evaluacion.servicios_evaluacion)
    evaluacion_servicios: GrupoEvaluacionEntity;

}