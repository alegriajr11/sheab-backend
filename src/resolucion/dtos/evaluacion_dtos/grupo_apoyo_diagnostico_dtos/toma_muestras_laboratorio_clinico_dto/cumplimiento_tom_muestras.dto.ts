import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoMuestraLabClinicoDto {

    @IsNotBlank()
    cump_mues_clin_cumple: string;

    @IsNotBlank()
    cump_mues_clin_hallazgo: string;

    @IsNotBlank()
    cump_mues_clin_accion: string;

    @IsNotBlank()
    cump_mues_clin_responsable: string;

    @IsNotBlank()
    cump_mues_clin_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}