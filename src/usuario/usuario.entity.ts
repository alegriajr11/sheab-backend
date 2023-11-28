/* eslint-disable prettier/prettier */
import { hash } from "bcrypt";
import { ActaIvcEntity } from "src/generarpdf/resolucion/ivc/acta-ivc.entity";
import { ActaVerificacionEntity } from "src/generarpdf/resolucion/verificacion/acta-verificacion.entity";
import { RolEntity } from "src/rol/rol.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity({ name: 'usuario' })
export class UsuarioEntity {

    @PrimaryGeneratedColumn('increment')
    usu_id: number;

    @Column({ type: 'varchar', length: 15, nullable: false })
    usu_cedula: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    usu_nombre: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    usu_apellido: string;

    @Column({ type: 'varchar', length: 30, nullable: false, unique: false })
    usu_email: string;

    @Column({ type: 'varchar', length: 10, nullable: false, unique: false })
    usu_nombreUsuario: string;

    @Column({ type: 'varchar', nullable: false })
    usu_password: string;

    @Column({ type: 'uuid', unique: true, name: 'reset_password_token', nullable: true })
    resetPasswordToken: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    usu_estado: string;

    @Column({ type: 'varchar', length: 70, nullable: false })
    usu_cargo: string;

    @Column({ type: 'varchar', length: 70, nullable: false })
    usu_area_profesional: string;

    @CreateDateColumn()
    usu_creado: Timestamp;

    @Column({ type: 'text', nullable: true })
    usu_firma: string; // Esta columna almacenará la firma en formato base64



    //Relacion Muchos a Muchos USUARIOS - ROL
    @ManyToMany(type => RolEntity, rol => rol.usuarios, { eager: true })
    @JoinTable({
        name: 'usuario_rol',
        joinColumn: { name: 'usuario_id' },
        inverseJoinColumn: { name: 'rol_id' }
    })
    roles: RolEntity[];

    @BeforeInsert()
    async hashPassword() {
        if (!this.usu_password) return;
        this.usu_password = await hash(this.usu_password, 10)
    }

    //RELACION VERIFICADORES ACTA DE VERIFICACION
    @ManyToMany(type => ActaVerificacionEntity, verificacion => verificacion.verificacion_usuario)
    usuario_verificacion: ActaVerificacionEntity;

    //RELACION VERIFICADORES ACTA DE IVC
    @ManyToMany(type => ActaIvcEntity, ivc => ivc.ivc_usuario)
    usuario_ivc: ActaIvcEntity;
}