/* eslint-disable prettier/prettier */
import { IsString, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CriterioImplementacionDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(500, {message: 'El criterio debe tener: longitud máxima de 500 caracteres'})
    cri_imp_nombre: string;


    @IsString()
    @MaxLength(200, {message: 'La verificación debe tener: longitud máxima de 200 caracteres'})
    cri_imp_verificacion: string

}