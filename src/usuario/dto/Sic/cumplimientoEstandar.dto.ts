/* eslint-disable prettier/prettier */
import { IsBoolean, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";
import { IsOptional } from 'class-validator';



export class CumplimientoEstandarSicDto {

    @IsNotBlank()
    @IsString()
    @MaxLength(11, {message: 'El Cumplimiento debe tener: longitud máxima de 11 caracteres'})
    cumpl_cumple: string;

    @IsString()
    @IsOptional()
    @MaxLength(300, {message: 'La Observacion debe tener: longitud máxima de 300 caracteres'})
    cumpl_observaciones: any;

    @IsString()
    cumpl_asignado: string

    @IsNumber()
    crie_id: number

    @IsNumber()
    eva_id: number
    
}