import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoRadiologiaOdontoDto {

    @IsNotBlank()
    cump_rad_odont_cumple: string;

    @IsNotBlank()
    cump_rad_odont_hallazgo: string;

    @IsNotBlank()
    cump_rad_odont_accion: string;

    @IsNotBlank()
    cump_rad_odont_responsable: string;

    @IsNotBlank()
    cump_rad_odont_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}