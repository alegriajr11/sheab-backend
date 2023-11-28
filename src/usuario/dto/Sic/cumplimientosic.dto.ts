/* eslint-disable prettier/prettier */
import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriteriosicEntity } from "src/sic/criteriosic.entity";


export class CumplimientoSicDto {


    @IsNotBlank()
    @IsString()
    @MaxLength(11, { message: 'El Cumplimiento debe tener: longitud máxima de 11 caracteres' })
    cumpl_cumple: string;

    @IsString()
    @MaxLength(300, { message: 'La Observacion debe tener: longitud máxima de 300 caracteres' })
    cumpl_observaciones: string;

    @IsNumber()
    cri_sic_id: number

    @IsNumber()
    eva_sic_id: number

    @IsNumber()
    ind_sic_id: string


}