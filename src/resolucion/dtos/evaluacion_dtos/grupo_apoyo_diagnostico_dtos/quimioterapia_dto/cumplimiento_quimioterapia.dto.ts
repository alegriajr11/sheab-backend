import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoQuimioterapiaDto {

    @IsNotBlank()
    cump_quim_cumple: string;

    @IsNotBlank()
    cump_quim_hallazgo: string;

    @IsNotBlank()
    cump_quim_accion: string;

    @IsNotBlank()
    cump_quim_responsable: string;

    @IsNotBlank()
    cump_quim_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}