/* eslint-disable prettier/prettier */
import { IsString, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CriterioIndDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(350, {message: 'El criterio debe tener: longitud máxima de 350 caracteres'})
    cri_nombre: string;


    @IsString()
    @MaxLength(120, {message: 'La verificación debe tener: longitud máxima de 120 caracteres'})
    cri_verificacion: string

}