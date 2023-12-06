import { IsNumber, IsObject, IsString } from "class-validator";
import { EvaluacionSicEntity } from "src/sic/evaluacionsic.entity";

export class DivCreadoSicDto {
    
    @IsNumber()
    div_numero_clones: number;

    @IsString()
    div_dominio: string;

    @IsString()
    div_indicador: string

    div_id_dominio: number

    div_id_indicador: number

    @IsObject({
        message: 'La evaluacion no puede estar vacia'
    })
    div_creado_eva: EvaluacionSicEntity;
}