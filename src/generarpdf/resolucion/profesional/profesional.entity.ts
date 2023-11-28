import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ActaVerificacionEntity } from '../verificacion/acta-verificacion.entity';

@Entity({ name: 'profesional-apoyo' })
export class ProfesionalApoyoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 20, nullable: false})
    prof_nombre: string

    @Column({type: 'varchar', length: 20, nullable: false})
    prof_apellido: string

    @Column({type: 'varchar', length: 60, nullable: false})
    prof_cargo: string;

    @ManyToMany(type => ActaVerificacionEntity, actaveri => actaveri.verificacion_profesional, { eager: true })
    @JoinTable({
        name: 'profe_veri',
        joinColumn: { name: 'prof_veri_id' },
        inverseJoinColumn: { name: 'veri_profe_id' }
    })
    profesional_verificacion: ActaVerificacionEntity[];

}