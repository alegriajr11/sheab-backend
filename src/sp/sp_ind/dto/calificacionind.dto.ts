import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Column } from "typeorm";

export class CalificacionindDto {

    @IsNotEmpty({ message: 'La calificación no debe estar en blanco' })
    @IsNumber({}, { message: 'La calificación debe ser un número' })
    cal_nota: number;
    
    @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
    cal_observaciones: string;

    @IsString()
    cal_asignado: string

    @IsNumber()
    cri_ind_id: number

    @IsNumber()
    eva_ind_id: number

}