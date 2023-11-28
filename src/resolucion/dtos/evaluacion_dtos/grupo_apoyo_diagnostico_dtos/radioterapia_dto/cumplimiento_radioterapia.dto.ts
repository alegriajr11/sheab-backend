import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoRadioterapiaDto {

    @IsNotBlank()
    cump_rad_ter_cumple: string;

    @IsNotBlank()
    cump_rad_ter_hallazgo: string;

    @IsNotBlank()
    cump_rad_ter_accion: string;

    @IsNotBlank()
    cump_rad_ter_responsable: string;

    @IsNotBlank()
    cump_rad_ter_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}