/* eslint-disable prettier/prettier */
import { EvaluacionPamecEntity } from "src/pamec/evaluacion-pamec.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity({ name: 'acta-pamec-pdf' })
export class ActaPamecEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 15, nullable: true })
    act_id: number;

    @Column({ type: 'varchar', length: 12, nullable: false })
    act_fecha_visita: string;

    @Column({ type: 'varchar', length: 60, nullable: false })
    act_tipo_visita: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_ano_formulacion: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_ciclo_mejoramiento: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    act_municipio: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    act_prestador: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    act_sede: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    act_sede_direccion: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    act_sede_barrio: string;

    @Column({ type: 'varchar', length: 11, nullable: false })
    act_nit: string;

    @Column({ type: 'varchar', length: 55, nullable: false })
    act_direccion: string;

    @Column({ type: 'varchar', length: 85, nullable: false })
    act_barrio: string;

    @Column({ type: 'varchar', length: 85, nullable: false })
    act_telefono: string;

    @Column({ type: 'varchar', length: 120, nullable: false })
    act_email: string;

    @Column({ type: 'varchar', length: 55, nullable: false })
    act_representante: string;

    @Column({ type: 'varchar', length: 12, nullable: false })
    act_cod_prestador

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_nombre_funcionario1

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_cargo_funcionario1

    @Column({ type: 'text', nullable: true })
    act_firma_funcionario1: string; // Esta columna almacenará la firma en formato base64

    @Column({ type: 'integer', nullable: true })
    act_id_funcionario1

    //ATRIBUTOS FUNCIONARIO OPCIONAL
    @Column({ type: 'varchar', length: 70, nullable: true })
    act_nombre_funcionario2

    @Column({ type: 'varchar', length: 70, nullable: true })
    act_cargo_funcionario2

    @Column({ type: 'text', nullable: true })
    act_firma_funcionario2: string; // Esta columna almacenará la firma en formato base64

    @Column({ type: 'integer', nullable: true })
    act_id_funcionario2
    //FIN ATRIBUTOS FUNCIONARIO OPCIONAL

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_nombre_prestador

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_cargo_prestador


    @Column({ type: 'varchar', length: 150, nullable: false })
    act_obj_visita

    @Column({ type: 'date' })
    act_creado: Date;

    @Column({ type: 'text', nullable: true })
    act_firma_prestador: string; // Esta columna almacenará la firma en formato base64

    @Column({ type: 'varchar', nullable: false, default: true })
    act_estado: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    act_hora: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    act_observaciones: string;

    @Column({ type: 'varchar', length: 10, nullable: true, default: 'true' })
    act_recibe_visita: string;

    @Column({ type: 'varchar', length: 10, nullable: true, default: 'false' })
    noFirmaActa: string;

    @BeforeInsert()
    async setDate() {
        this.act_creado = new Date();
    }

    // RELACION UNO A UNO PAMEC ACTA - EVALUACION ACTA
    @OneToOne(() => EvaluacionPamecEntity, evaluacionPamec => evaluacionPamec.eval_acta_pamec)
    act_eval_pamec: EvaluacionPamecEntity;
}