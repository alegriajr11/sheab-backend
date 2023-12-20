import { IsNumber, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CriteriosApoyoDiagnosticoDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La modalidad debe tener una longitud máxima de 105 caracteres'})
    cri_apoyo_modalidad: string

    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La Complejidad debe tener una longitud máxima de 105 caracteres'})
    cri_apoyo_complejidad: string


    cri_apoyo_articulo: string


    @IsNotBlank() 
    @IsString() 
    @MaxLength(700, {message: 'El criterio debe tener una longitud máxima de 700 caracteres'})
    cri_apoyo_nombre_criterio: string;

    @IsNumber()
    seccion_id: number

    @IsString() 
    apartado_id: string
}