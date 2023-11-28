/* eslint-disable prettier/prettier */

import { IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";
import { Column } from "typeorm";

export class ActaPamecDto {

    @IsNotBlank()
    act_id: number;

    @IsNotBlank()
    act_tipo_visita: string;

    act_ano_formulacion: string;

    act_ciclo_mejoramiento: string;
    
    @IsNotBlank()
    act_fecha_visita: string;

    @IsNotBlank()
    act_municipio: string

    @IsNotBlank()
    act_prestador: string

    @IsNotBlank()
    act_nit: string

    @IsNotBlank()
    act_direccion: string

    @IsNotBlank()
    act_barrio: string

    @IsNotBlank()
    act_telefono: string

    @IsNotBlank()
    act_email: string

    @IsNotBlank()
    act_representante: string

    @IsNotBlank()
    act_cod_prestador: string

    act_sede: string

    act_sede_barrio: string

    act_sede_direccion: string

    @IsNotBlank()
    act_obj_visita: string

    @IsNotBlank()
    act_nombre_funcionario1: string

    @IsNotBlank()
    act_cargo_funcionario1: string

    act_firma_funcionario1: string

    @IsNotBlank()
    act_id_funcionario1: number

    //FUNCIONARIO 2
    act_nombre_funcionario2: string

    act_cargo_funcionario2: string

    act_firma_funcionario2: string

    act_id_funcionario2: number

    //PRESTADOR RECIBE VISITA
    @IsNotBlank()
    act_nombre_prestador: string

    @IsNotBlank()
    act_cargo_prestador: string
    
    @IsNotBlank()
    act_firma_prestador: string

    @IsString()
    act_estado: string;

    @IsString()
    act_recibe_visita: string

    @IsString()
    noFirmaActa: string

    @IsString()
    act_hora: string;

    @IsString()
    act_observaciones: string;
}