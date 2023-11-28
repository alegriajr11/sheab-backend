import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoDiagnostiVascularDto {

    @IsNotBlank()
    cump_diagv_cumple: string;

    @IsNotBlank()
    cump_diagv_hallazgo: string;

    @IsNotBlank()
    cump_diagv_accion: string;

    @IsNotBlank()
    cump_diagv_responsable: string;

    @IsNotBlank()
    cump_diagv_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}