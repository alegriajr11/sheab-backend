import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoPatologiaDto {

    @IsNotBlank()
    cump_pato_cumple: string;

    @IsNotBlank()
    cump_pato_hallazgo: string;

    @IsNotBlank()
    cump_pato_accion: string;

    @IsNotBlank()
    cump_pato_responsable: string;

    @IsNotBlank()
    cump_pato_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}