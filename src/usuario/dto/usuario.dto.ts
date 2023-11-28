/* eslint-disable prettier/prettier */
import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class UsuarioDto {
    
    @IsString()
    @MaxLength(20, {message: 'nombre: longitud máxima de 20'})
    usu_nombre: string;

    @IsString()
    @MaxLength(20, {message: 'nombre: longitud máxima de 20'})
    usu_apellido: string;

    @IsNotBlank({message: 'el nombre de usuario no puede estar vacio'})
    @MaxLength(10, {message: 'nombre de usuario: longitud máxima de 10'})
    usu_nombreUsuario: string;
    
    @IsString()
    usu_estado: string;

    @IsString()
    usu_cargo: string;

    @IsString()
    usu_area_profesional: string;

    @IsString()
    usu_firma: string

    @IsArray()
    roles: number[]; // Supongo que los roles son representados por IDs

}