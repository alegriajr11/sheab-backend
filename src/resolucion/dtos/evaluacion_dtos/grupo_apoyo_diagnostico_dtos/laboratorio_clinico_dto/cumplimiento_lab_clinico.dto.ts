import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoLabClinicoDto {

    @IsNotBlank()
    cump_labclin_cumple: string;

    @IsNotBlank()
    cump_labclin_hallazgo: string;

    @IsNotBlank()
    cump_labclin_accion: string;

    @IsNotBlank()
    cump_labclin_responsable: string;

    @IsNotBlank()
    cump_labclin_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}