import { IsNumber } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class ServiciosVerificadosDto {

    @IsNotBlank()
    ser_codigo: string;
    
    @IsNotBlank()
    ser_nombre: string;

    
    @IsNotBlank()
    ambulatorio: string;

    
    @IsNotBlank()
    hospitalario: string;

    
    @IsNotBlank()
    unidad_movil: string;

    
    @IsNotBlank()
    domiciliario: string;

    
    @IsNotBlank()
    otras_extramural: string;

    
    @IsNotBlank()
    centro_referencia: string;

    
    @IsNotBlank()
    institucion_remisora: string;

    
    @IsNotBlank()
    complejidad_baja: string;

    
    @IsNotBlank()
    complejidad_media: string;

    @IsNotBlank()
    complejidad_alta: string;

    @IsNumber()
    ser_grupo_eva_id: number
    
    
    }