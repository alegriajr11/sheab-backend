import { IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CriteriosAtencionInmediataDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La modalidad debe tener una longitud máxima de 105 caracteres'})
    cri_atencion_modalidad: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La Complejidad debe tener una longitud máxima de 105 caracteres'})
    cri_atencion_complejidad: string;

    
    cri_atencion_articulo: string;

    
    cri_atencion_seccion: string;

    
    cri_atencion_apartado: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(700, {message: 'El criterio debe tener una longitud máxima de 700 caracteres'})
    cri_atencion_nombre_criterio: string;
}