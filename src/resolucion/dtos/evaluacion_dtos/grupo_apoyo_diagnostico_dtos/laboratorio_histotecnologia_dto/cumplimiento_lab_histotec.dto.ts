import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoLabHistotecnologiaDto {

    @IsNotBlank()
    cump_labhistot_cumple: string;

    @IsNotBlank()
    cump_labhistot_hallazgo: string;

    @IsNotBlank()
    cump_labhistot_accion: string;

    @IsNotBlank()
    cump_labhistot_responsable: string;

    @IsNotBlank()
    cump_labhistot_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}