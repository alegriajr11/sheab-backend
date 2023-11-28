/* eslint-disable prettier/prettier */
import { IsString, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CriterioEstandarDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(220, {message: 'El criterio debe tener: longitud máxima de 220 caracteres'})
    crie_nombre: string;


}