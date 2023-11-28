import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GrupoEvaluacionEntity } from "../grupo_evaluacion/grupo_evaluacion.entity";



@Entity({ name: 'servicios_verificados' })
export class ServiciosVerificadosEntity {
    @PrimaryGeneratedColumn('increment')
    ser_id: number;

    @Column({ type: 'varchar', length: 5, nullable: false, unique: false })
    ser_codigo: string;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: false })
    ser_nombre: string;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    ambulatorio: string;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    hospitalario: string;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    unidad_movil: string;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    domiciliario: string;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    otras_extramural: string;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    centro_referencia: string;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    institucion_remisora: string;

    @Column({ type: 'varchar', length: 5, nullable: false, unique: false })
    complejidad_baja: string;

    @Column({ type: 'varchar', length: 5, nullable: false, unique: false })
    complejidad_media: string;

    @Column({ type: 'varchar', length: 5, nullable: false, unique: false })
    complejidad_alta: string;

    

    //Relacion MUCHOS a UNO SERVICIOS VERIFICADOS- GRUPO EVALUACION
    @ManyToOne(type => GrupoEvaluacionEntity, gtup_eval => gtup_eval.seriv_verif_grup_eval)
    grup_evaluacion: GrupoEvaluacionEntity

    @ManyToOne(type => PrestadorEntity, prestador => prestador.servicios_verificados)
    prestadores: PrestadorEntity
}