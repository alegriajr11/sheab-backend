/* eslint-disable prettier/prettier */
import { IsString, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CriterioVerificacionDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(530, {message: 'El criterio debe tener: longitud máxima de 530 caracteres'})
    cri_ver_nombre: string;


    @IsString()
    @MaxLength(200, {message: 'La verificación debe tener: longitud máxima de 200 caracteres'})
    cri_ver_verificacion: string

}