import { IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CriteriosConsultaExternaDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La modalidad debe tener una longitud máxima de 105 caracteres'})
    criext_modalidad: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La Complejidad debe tener una longitud máxima de 105 caracteres'})
    criext_complejidad: string;

    
    criext_articulo: string;

    
    criext_seccion: string;

    
    criext_apartado: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(700, {message: 'El criterio debe tener una longitud máxima de 700 caracteres'})
    criext_nombre_criterio: string;
}