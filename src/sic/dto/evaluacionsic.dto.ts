import { IsDate, IsNumber } from "class-validator";


export class EvaluacionSicDto {
    
    @IsNumber()
    @IsDate()
    eva_creado: Date;

}