/* eslint-disable prettier/prettier */
import { IsDate, IsNumber, IsString, MaxLength, MinLength } from "class-validator";


export class EvaluacionIndependientesDto {
    
    @IsNumber()
    @IsDate()
    eva_creado: Date;

}