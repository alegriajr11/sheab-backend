import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoMedicinaNuclearDto {

    @IsNotBlank()
    cump_med_nucl_cumple: string;

    @IsNotBlank()
    cump_med_nucl_hallazgo: string;

    @IsNotBlank()
    cump_med_nucl_accion: string;

    @IsNotBlank()
    cump_med_nucl_responsable: string;

    @IsNotBlank()
    cump_med_nucl_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}