import { SedeEntity } from "src/prestador/sede/sede.entity";
import { UsuarioEntity } from "src/usuario/usuario.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { ProfesionalApoyoEntity } from "../profesional/profesional.entity";
import { DatosVisitVErificadoEntity } from "../visita-verificacion/datos-visit-verificado.entity";
import { ConceptoResEntity } from "src/resolucion/requisitos_condiciones_habilitacion/concepto_res.entity";
import { EvaluacionResVerificacionEntity } from "src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity";

@Entity({ name: 'acta-verificacion' })
export class ActaVerificacionEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 15, nullable: true })
    act_id: number;

    @Column({ type: 'varchar', length: 2, nullable: true })
    act_visita_previa: string;

    @Column({ type: 'varchar', length: 2, nullable: true })
    act_visita_seguimiento: string;

    @Column({ type: 'varchar', length: 2, nullable: true })
    act_visita_reactivacion: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    act_municipio: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    act_prestador: string;

    @Column({ type: 'varchar', length: 11, nullable: false })
    act_nit: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    act_sede: string;

    @Column({ type: 'varchar', length: 55, nullable: false })
    act_direccion: string;

    @Column({ type: 'varchar', length: 70, nullable: true })
    act_cargo_prestador: string;

    @Column({ type: 'varchar', length: 12, nullable: false })
    act_cod_habilitacion: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_cod_sede: string;

    @Column({ type: 'varchar', length: 85, nullable: false })
    act_telefono: string;

    @Column({ type: 'varchar', length: 55, nullable: false })
    act_representante: string;

    @Column({ type: 'varchar', length: 55, nullable: false })
    act_gerente: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    act_correo: string;

    @Column({ type: 'date' })
    act_fecha_inicio: Date;

    @Column({ type: 'date' })
    act_fecha_final: Date;

    @Column({ type: 'varchar', length: 200, nullable: true })
    act_observaciones: string

    @Column({ type: 'text', nullable: true })
    act_firma_prestador: string;

    @Column({ type: 'varchar', length: 85, nullable: false })
    act_funcionario_prestador: string

    @Column({ type: 'varchar', nullable: false, default: true })
    act_estado: string;

    @Column({ type: 'date' })
    act_creado: Date;

    @BeforeInsert()
    async setDate() {
        this.act_creado = new Date();
    }

    @Column({ type: 'varchar', length: 10, nullable: true, default: 'true' })
    act_recibe_visita: string;

    @Column({ type: 'varchar', length: 10, nullable: true, default: 'false' })
    noFirmaActa: string;

    // RELACION UNO A UNO ACTA VERIFICACION - SEDE
    @OneToOne(() => SedeEntity, sede => sede.acta_verificacion_sede)
    @JoinColumn()
    act_sede_veri: SedeEntity;

    @OneToOne(() => DatosVisitVErificadoEntity, datosencontrados => datosencontrados.acta_verificacion_datos_encontrados)
    act_datos_encontrados_verificacion: DatosVisitVErificadoEntity;

    @ManyToMany(type => UsuarioEntity, usuario => usuario.usuario_verificacion, { eager: true })
    @JoinTable({
        name: 'verif_usuario',
        joinColumn: { name: 'verif_usu_id' },
        inverseJoinColumn: { name: 'usu_verif_id' },
    })
    verificacion_usuario: UsuarioEntity[];

    @ManyToMany(type => ProfesionalApoyoEntity, profecional => profecional.profesional_verificacion)
    verificacion_profesional: ProfesionalApoyoEntity;

    @ManyToMany(type => ConceptoResEntity, concepto_resolucion_codiciones => concepto_resolucion_codiciones.concepto3100_acta_verificacion)
    acta_verificacion_concepto3100: ConceptoResEntity;

    //Relacion UNO a UNO EVALUACION VERIFICACION - ACTA VERIFICACION
    @OneToOne(() => EvaluacionResVerificacionEntity, evaluacion_verificacion => evaluacion_verificacion.eval_acta_veri)
    act_eval_veri: EvaluacionResVerificacionEntity;
}