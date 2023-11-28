import { IsDate } from "class-validator";

export class EvaluacionResolucionVerificacionDto {
    
    @IsDate()
    eva_creado: Date;

}