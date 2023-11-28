import { IsDate, IsNumber, IsString, MaxLength, MinLength } from "class-validator";


export class EvaluacionPamecDto {
    
    @IsNumber()
    @IsDate()
    eva_creado: Date;

}