/* eslint-disable prettier/prettier */
import { IsEmail, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class ClasificacionDto {
    
    @IsString()
    @MaxLength(70, {message: 'clasificacion: longitud máxima de 70'})
    cla_nombre: string;
    
}