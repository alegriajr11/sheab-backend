/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsNumber, IsObject, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";
import { RolEntity } from "src/rol/rol.entity";
import { Column } from "typeorm";



export class NuevoUsuarioDto {

    @IsNotBlank({ message: "Cédula no puede estar vacia" })
    @IsString()
    @MaxLength(15, { message: "Cédula: Longitud máxima de 15" })
    usu_cedula: string

    @IsNotBlank({ message: "El nombre no puede estar vacio" })
    @IsString()
    @MaxLength(20, { message: "Nombre: Longitud máxima de 20" })
    usu_nombre: string;

    @IsNotBlank({ message: "El apellido no puede estar vacio" })
    @IsString()
    @MaxLength(20, { message: 'Apellido: Longitud máxima de 20' })
    usu_apellido: string;

    @IsNotBlank({ message: "El Cargo no puede estar vacio" })
    @IsString()
    usu_cargo: string

    @IsNotBlank({ message: "El Cargo Área Profesional no puede estar vacio" })
    @IsString()
    usu_area_profesional: string

    @IsNotBlank({ message: 'El email no puede estar vacio' })
    @IsEmail({}, { message: 'Email no valido' })
    usu_email: string;

    @IsNotBlank({ message: 'El nombre de usuario no puede estar vacio' })
    @MaxLength(10, { message: 'Nombre de usuario: Longitud máxima de 10' })
    usu_nombreUsuario: string;

    @IsNotBlank({ message: 'La contraseña del usuario no puede estar vacia' })
    usu_password: string;

    @IsNotBlank({ message: 'La firma del usuario no puede estar vacia' })
    usu_firma: string


    @IsNotBlank({ message: 'El estado del usuario no puede estar vacio' })
    @IsString()
    usu_estado: string;



}

