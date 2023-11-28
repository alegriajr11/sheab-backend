import { IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CriterioGestionPretransfusionalDto {

    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La modalidad debe tener una longitud máxima de 105 caracteres'})
    crigestpre_modalidad: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La Complejidad debe tener una longitud máxima de 105 caracteres'})
    crigestpre_complejidad: string;

    
    crigestpre_articulo: string;

    
    crigestpre_seccion: string;

    
    crigestpre_apartado: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(700, {message: 'El criterio debe tener una longitud máxima de 700 caracteres'})
    crigestpre_nombre_criterio: string;

}