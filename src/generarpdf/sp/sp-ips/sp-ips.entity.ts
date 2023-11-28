/* eslint-disable prettier/prettier */
import { EvaluacionipsCreadasEntity } from "src/sp/sp_ips/evaluacion_ips_creada.entity";
import { EvaluacionipsEntity } from "src/sp/sp_ips/evaluacionips.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity({ name: 'acta-sp-ips-pdf' })
export class ActaSpIpsEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 15, nullable: true })
    act_id: number;

    @Column({ type: 'varchar', length: 2, nullable: true })
    act_visita_inicial: string;

    @Column({ type: 'varchar', length: 2, nullable: true })
    act_visita_seguimiento: string;

    @Column({ type: 'varchar', length: 12, nullable: false })
    act_fecha_inicial: string;

    @Column({ type: 'varchar', length: 12, nullable: false })
    act_fecha_final: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    act_municipio: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    act_prestador: string;

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

    @Column({ type: 'varchar', length: 150, nullable: false })
    act_obj_visita

    @Column({ type: 'integer', nullable: true })
    act_id_funcionario

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_nombre_funcionario

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_cargo_funcionario

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_nombre_prestador

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_cargo_prestador

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_nombre_prestador_acompanante

    @Column({ type: 'varchar', length: 70, nullable: false })
    act_cargo_prestador_acompanante

    @Column({ type: 'date' })
    act_creado: Date;

    @Column({ type: 'text', nullable: true })
    act_firma_funcionario: string; // Esta columna almacenará la firma en formato base64 del funcionario

    @Column({ type: 'text', nullable: true })
    act_firma_prestador: string; // Esta columna almacenará la firma en formato base64 del representante

    @Column({ type: 'text', nullable: true })
    act_firma_prestador_acompanante: string; // Esta columna almacenará la firma en formato base64 del acompañante

    @Column({ type: 'varchar', length: 2, nullable: false, default: true })
    act_estado: string;

    //ATRIBUTOS PARA EL ORDÉN DEL DÍA
    //1. Presentación ante Gerente y/o su delegado.
    @Column({ type: 'varchar', length: 30, nullable: false })
    act_fecha_orden: string;

    @Column({ type: 'varchar', length: 30, nullable: false })
    act_hora_orden: string;

    @Column({ type: 'varchar', length: 30, nullable: false })
    act_num_oficio: string

    @Column({ type: 'varchar', length: 30, nullable: false })
    act_fecha_oficio: string

    @Column({ type: 'varchar', length: 30, nullable: false })
    act_fecha_envio_oficio: string

    //3. Caracterización de los servicios ofertados. 
    @Column({ type: 'varchar', length: 255, nullable: true }) // Columna para guardar captura de imagen
    act_captura_imagen: string;


    //ATRIBUTOS COMPROMISOS
    @Column({ type: 'varchar', length: 255, nullable: true })
    act_compromiso_actividad: string;
    //ATRIBUTOS COMPROMISOS

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_compromiso_fecha: string;
    //ATRIBUTOS COMPROMISOS

    @Column({ type: 'varchar', length: 60, nullable: true })
    act_compromiso_responsable: string;


    @Column({ type: 'varchar', length: 10, nullable: true, default: 'true' })
    act_recibe_visita: string;
    
    @Column({ type: 'varchar', length: 10, nullable: true, default: 'false' })
    noFirmaActa: string; 

    @BeforeInsert()
    async setDate() {
        this.act_creado = new Date();
    }

    //Relacion UNO a UNO EVALUACION SP IPS CREADAS - ACTAS SP IPS
    @OneToOne(() => EvaluacionipsCreadasEntity, evaluacionIps => evaluacionIps.eval_acta_spips)
    act_eval_ips: EvaluacionipsCreadasEntity;

    //Relacion Muchos a Muchos ACTA_IPS - EVALUACIONES EXISTENTES
    @ManyToMany(type => EvaluacionipsEntity, evaluacion => evaluacion.actas_ips, { eager: true })
    @JoinTable({
        name: 'actaips_evaluacion',
        joinColumn: { name: 'acta_id' },
        inverseJoinColumn: { name: 'eva_id' }
    })
    evaluacionesips: EvaluacionipsEntity[];

}