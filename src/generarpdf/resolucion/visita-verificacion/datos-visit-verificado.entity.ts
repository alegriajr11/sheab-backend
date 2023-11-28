import { SedeEntity } from "src/prestador/sede/sede.entity";
import { UsuarioEntity } from "src/usuario/usuario.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { ProfesionalApoyoEntity } from "../profesional/profesional.entity";
import { ActaVerificacionEntity } from "../verificacion/acta-verificacion.entity";

@Entity({name: 'datos-verificados'})
export class DatosVisitVErificadoEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 85, nullable: false})
    dat_encontrado_telefono: string;

    @Column({type: 'varchar', length: 55, nullable: false})
    dat_encontrado_direccion: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    dat_encontrado_correo: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    act_observaciones: string;


    // RELACION UNO A UNO ACTA VERIFICACION - DATOS VERIFICADOS ENCONTRADOS
    @OneToOne(() => ActaVerificacionEntity, actaVerificacion => actaVerificacion.act_datos_encontrados_verificacion)
    @JoinColumn()
    acta_verificacion_datos_encontrados: ActaVerificacionEntity;
    
}