import { IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CriterioCuidIntermNeonatalDto {


    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La modalidad debe tener una longitud máxima de 105 caracteres'})
    cri_inter_neon_modalidad: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(105, {message: 'La Complejidad debe tener una longitud máxima de 105 caracteres'})
    cri_inter_neon_complejidad: string;


    cri_inter_neon_articulo: string;

    cri_inter_neon_seccion: string;


    cri_inter_neon_apartado: string;

    @IsNotBlank()
    @IsString()
    @MaxLength(700, {message: 'El criterio debe tener una longitud máxima de 700 caracteres'})
    cri_inter_neon_nombre_criterio: string;
}