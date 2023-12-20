import { IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CriteriosInternacionDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La modalidad debe tener una longitud máxima de 105 caracteres'})
    cri_inter_modalidad: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La Complejidad debe tener una longitud máxima de 105 caracteres'})
    cri_inter_complejidad: string;

    
    cri_inter_articulo: string;


    @IsNotBlank()
    @IsString()
    @MaxLength(700, {message: 'El criterio debe tener una longitud máxima de 700 caracteres'})
    cri_inter_nombre_criterio: string;


    cri_inter_seccion: number;

    
    cri_inter_apartado: string;
}