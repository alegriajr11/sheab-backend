import { IsString } from "class-validator";

export class DatosVerificadosDto {

    @IsString()
    dat_encontrado_direccion: string

    @IsString()
    dat_encontrado_telefono: string

    @IsString()
    dat_encontrado_correo: string

    @IsString()
    act_observaciones: string
}