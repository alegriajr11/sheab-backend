/* eslint-disable prettier/prettier */
import { EvaluacionIndependientesEntity } from "src/sp/sp_ind/evaluacion-independientes.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity({name: 'acta-sp-ind-pdf'})
export class ActaSpIndependientePdfEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 15, nullable: true})
    act_id: number;

    @Column({type: 'varchar', length: 2, nullable: true})
    act_visita_inicial: string;

    @Column({type: 'varchar', length: 2, nullable: true})
    act_visita_seguimiento: string;

    @Column({type: 'varchar', length: 12, nullable: false})
    act_fecha_inicial: string;

    @Column({type: 'varchar', length: 12, nullable: false})
    act_fecha_final: string;

    @Column({type: 'varchar', length: 20, nullable: false})
    act_municipio: string;

    @Column({type: 'varchar', length: 100, nullable: false})
    act_prestador: string;

    @Column({type: 'varchar', length: 11, nullable: false})
    act_nit: string;

    @Column({type: 'varchar', length: 55, nullable: false})
    act_direccion: string;

    @Column({type: 'varchar', length: 85, nullable: false})
    act_barrio: string;

    @Column({type: 'varchar', length: 85, nullable: false})
    act_telefono: string;

    @Column({type: 'varchar', length: 120, nullable: false})
    act_email: string;

    @Column({type: 'varchar', length: 55, nullable: false})
    act_representante: string;

    @Column({type: 'varchar', length: 15, nullable: false})
    act_cod_prestador

    @Column({type: 'varchar', length: 150, nullable: false})
    act_obj_visita

    @Column({ type: 'integer', nullable: true })
    act_id_funcionario
    
    @Column({type: 'varchar', length: 70, nullable: false})
    act_nombre_funcionario

    @Column({type: 'varchar', length: 70, nullable: false})
    act_cargo_funcionario

    @Column({type: 'varchar', length: 70, nullable: false})
    act_nombre_prestador

    @Column({type: 'varchar', length: 70, nullable: false})
    act_cargo_prestador

    @Column({ type: 'date' })
    act_creado: Date;

    @Column({ type: 'text', nullable: true })
    act_firma_funcionario: string; // Esta columna almacenará la firma en formato base64

    @Column({ type: 'text', nullable: true })
    act_firma_prestador: string; // Esta columna almacenará la firma en formato base64

    @Column({ type: 'varchar', nullable: false, default:true })
    act_estado: string;

    @Column({ type: 'varchar', length: 10, nullable: true, default: 'true' })
    act_recibe_visita: string;
    
    @Column({ type: 'varchar', length: 10, nullable: true, default: 'false' })
    noFirmaActa: string;    
    

    @BeforeInsert()
    async setDate() {
        this.act_creado = new Date();
    }

    

    @OneToOne(() => EvaluacionIndependientesEntity, evaluacionIndependientes => evaluacionIndependientes.eval_acta_ind)
    act_eval_ind: EvaluacionIndependientesEntity;
}