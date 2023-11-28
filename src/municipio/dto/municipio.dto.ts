/* eslint-disable prettier/prettier */
import { IsEmail, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class MunicipioDto {
    
    @IsString()
    @MaxLength(70, {message: 'nombre de municipio: longitud máxima de 70'})
    mun_nombre: string;
    
}