/* eslint-disable prettier/prettier */
import { IsString, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CriterioSicDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(120, {message: 'El criterio debe tener: longitud máxima de 350 caracteres'})
    cri_nombre: string;

}