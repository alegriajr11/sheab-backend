import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoGestionPretransfusionalDto{

    @IsNotBlank()
    cump_gestpre_cumple: string;

    @IsNotBlank()
    cump_gestpre_hallazgo: string;

    @IsNotBlank()
    cump_gestpre_accion: string;

    @IsNotBlank()
    cump_gestpre_responsable: string;

    @IsNotBlank()
    cump_gestpre_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}