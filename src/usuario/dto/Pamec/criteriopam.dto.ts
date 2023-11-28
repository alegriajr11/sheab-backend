/* eslint-disable prettier/prettier */
import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CriterioPamDto {
    
    @IsNotBlank()
    // @IsString()
    // @MaxLength(700, {message: 'el criterio debe tener: longitud máxima de 700 caracteres'})
    crip_nombre: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(700, {message: 'el desarrollo etapas debe tener: longitud máxima de 700 caracteres'})
    crip_desarrollo_etapas: string;

}