import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoLabUterinaDto {

    @IsNotBlank()
    cump_labuter_cumple: string;

    @IsNotBlank()
    cump_labuter_hallazgo: string;

    @IsNotBlank()
    cump_labuter_accion: string;

    @IsNotBlank()
    cump_labuter_responsable: string;

    @IsNotBlank()
    cump_labuter_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}