import { SedeEntity } from "src/prestador/sede/sede.entity";
import { UsuarioEntity } from "src/usuario/usuario.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { ProfesionalApoyoEntity } from "../profesional/profesional.entity";
import { DatosVisitVErificadoEntity } from "../visita-verificacion/datos-visit-verificado.entity";

@Entity({ name: 'acta-ivc' })
export class ActaIvcEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 15, nullable: true })
    act_id: number;

    @Column({ type: 'varchar', length: 20, nullable: false })
    act_municipio: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    act_prestador: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_fecha_apertura: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_hora_apertura: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_fecha_cierre: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_hora_cierre: string;

    @Column({ type: 'varchar', length: 80, nullable: true })
    act_responsable_visita: string;

    @Column({ type: 'varchar', length: 80, nullable: true })
    act_dependencia_visita: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    act_telefono_dependencia_visita: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    act_email_dependencia_visita: string;

    @Column({ type: 'varchar', length: 6, nullable: true })
    act_numero_oficio: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_fecha_oficio: string;

    @Column({ type: 'varchar', length: 12, nullable: true })
    act_registro_queja: string;


    //MOTIVO DE LA VISITA
    @Column({ type: 'varchar', length: 50, nullable: true })
    act_motivo_visita: string

    //DATOS PRESTADOR
    @Column({ type: 'varchar', length: 100, nullable: true })
    act_sede_prestador: string

    @Column({ type: 'varchar', length: 100, nullable: true })
    act_tipo_prestador: string

    @Column({ type: 'varchar', length: 12, nullable: false })
    act_cod_habilitacion: string;

    @Column({ type: 'varchar', length: 11, nullable: false })
    act_nit: string;

    @Column({ type: 'varchar', length: 12, nullable: false })
    act_cod_sede: string;

    @Column({ type: 'varchar', length: 85, nullable: false })
    act_telefono: string;

    @Column({ type: 'varchar', length: 55, nullable: false })
    act_direccion_sede: string;

    @Column({ type: 'varchar', length: 55, nullable: false })
    act_representante_legal: string;

    @Column({ type: 'varchar', length: 55, nullable: false })
    act_gerente: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    act_correo_prestador: string;

    @Column({ type: 'varchar', length: 2, nullable: false })
    act_notificacion_electronica: string;

    @Column({ type: 'varchar', length: 11, nullable: false })
    act_tecnico_administrativa: string;

    @Column({ type: 'varchar', length: 11, nullable: false })
    act_patrimonial_financiera: string;

    @Column({ type: 'varchar', length: 85, nullable: false })
    act_funcionario_prestador: string


    //-------------------------------------

    @Column({ type: 'text', nullable: false })
    act_firma_prestador: string;

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

    // RELACION UNO A UNO ACTA IVC - SEDE
    @OneToOne(() => SedeEntity, sede => sede.acta_ivc_sede)
    @JoinColumn()
    act_sede_ivc: SedeEntity;

    //RELACION VERIFICADORES ACTA IVC - USUARIOS
    @ManyToMany(type => UsuarioEntity, usuario => usuario.usuario_ivc, { eager: true })
    @JoinTable({
        name: 'ivc_usuario',
        joinColumn: { name: 'ivc_usu_id' },
        inverseJoinColumn: { name: 'usu_ivc_id' }
    })
    ivc_usuario: SedeEntity[];

}