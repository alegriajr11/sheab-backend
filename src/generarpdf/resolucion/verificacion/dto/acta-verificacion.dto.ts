import { IsString } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class ActaVerificacionDto {

    @IsNotBlank()
    act_id: number;

    @IsString()
    act_visita_previa: string;

    @IsString()
    act_visita_seguimiento: string;

    @IsString()
    act_visita_reactivacion: string;

    @IsString()
    act_municipio: string;

    @IsString()
    act_prestador: string;

    @IsString()
    act_nit: string;

    @IsString()
    act_sede: string;

    @IsString()
    act_direccion: string;

    @IsString()
    act_cargo_prestador: string;

    @IsString()
    act_cod_habilitacion: string;

    @IsString()
    act_cod_sede: string;

    @IsString()
    act_telefono: string;

    @IsString()
    act_representante: string;

    @IsString()
    act_gerente: string;

    @IsString()
    act_correo: string;

    @IsString()
    act_fecha_inicio: string

    @IsString()
    act_fecha_final: string;

    @IsString()
    act_observaciones: string

    @IsString()
    act_funcionario_prestador: string;

    @IsString()
    act_firma_prestador: string;

    @IsString()
    act_estado: string;

    @IsString()
    act_recibe_visita: string

    @IsString()
    noFirmaActa: string
}