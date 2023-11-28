/* eslint-disable prettier/prettier */
import { type } from "os";
import { UsuarioEntity } from "src/usuario/usuario.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolNombre } from "./rol.enum";

@Entity({name: 'rol'})
export class RolEntity {
    
    @PrimaryGeneratedColumn('increment')
    rol_id: number;

    @Column({type: 'varchar', length: 20, nullable: false, unique: false})
    rol_nombre: RolNombre;
    
    //Relacion Muchos a Muchos ROL - USUARIOS
    @ManyToMany(type => UsuarioEntity, usuario => usuario.roles)
    usuarios: UsuarioEntity[];
}