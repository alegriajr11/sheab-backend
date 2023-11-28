/* eslint-disable prettier/prettier */

import { IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";
import { Column } from "typeorm";

export class IpsDto {

    @IsNotBlank()
    act_id: number;
    
    @Column({ nullable: true })
    act_visita_inicial?: string;

    @Column({ nullable: true })
    act_visita_seguimiento?: string;

    @IsNotBlank()
    act_fecha_inicial: string

    @IsNotBlank()
    act_fecha_final: string

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

    @IsNotBlank()
    act_obj_visita: string

    @IsNotBlank()
    act_id_funcionario: number

    @IsNotBlank()
    act_nombre_funcionario: string

    @IsNotBlank()
    act_cargo_funcionario: string

    @IsNotBlank()
    act_nombre_prestador: string

    @IsNotBlank()
    act_cargo_prestador: string

    @IsNotBlank()
    act_nombre_prestador_acompanante: string

    @IsNotBlank()
    act_cargo_prestador_acompanante: string

    @IsNotBlank()
    act_firma_funcionario: string
    
    @IsNotBlank()
    act_firma_prestador: string

    @IsNotBlank()
    act_firma_prestador_acompanante: string

    @Column({ type: 'varchar', length: 10, nullable: true, default: 'false' })
    act_recibe_visita: string;
    
    @Column({ type: 'varchar', length: 10, nullable: true, default: 'false' })
    noFirmaActa: string;    

    //ATRIBUTOS COMPROMISOS
    @IsString()
    @MaxLength(255, { message: 'La longitud de Actividad Compromiso no puede superar los 255 caracteres' })
    act_compromiso_actividad: string;
    @IsString()
    act_compromiso_fecha: string
    @IsString()
    act_compromiso_responsable: string


    @IsString()
    act_estado: string;


}