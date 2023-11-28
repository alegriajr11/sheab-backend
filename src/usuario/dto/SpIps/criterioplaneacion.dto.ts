/* eslint-disable prettier/prettier */
import { IsString, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CriterioPlaneacionDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(620, {message: 'El criterio debe tener: longitud máxima de 620 caracteres'})
    cri_pla_nombre: string;


    @IsString()
    @MaxLength(300, {message: 'La verificación debe tener: longitud máxima de 300 caracteres'})
    cri_pla_verificacion: string

}