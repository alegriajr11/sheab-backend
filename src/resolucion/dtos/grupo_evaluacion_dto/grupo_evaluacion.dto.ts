import { IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class GrupoEvaluacionDto {
    
    @IsNotBlank()
    @IsString()
    @MaxLength(20, {message: 'El nombre debe tener una longitud máxima de 20 caracteres'})
    nombre: string;
}