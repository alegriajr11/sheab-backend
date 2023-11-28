import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoCuelloUterinoDto {

    @IsNotBlank()
    cump_cue_uter_cumple: string;

    @IsNotBlank()
    cump_cue_uter_hallazgo: string;

    @IsNotBlank()
    cump_cue_uter_accion: string;

    @IsNotBlank()
    cump_cue_uter_responsable: string;

    @IsNotBlank()
    cump_cue_uter_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}