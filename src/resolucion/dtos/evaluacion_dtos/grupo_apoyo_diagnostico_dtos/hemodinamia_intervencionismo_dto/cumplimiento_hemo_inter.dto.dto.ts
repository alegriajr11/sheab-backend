import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoHermodinamiaIntervenDto {

    @IsNotBlank()
    cump_herminter_cumple: string;

    @IsNotBlank()
    cump_herminter_hallazgo: string;

    @IsNotBlank()
    cump_herminter_accion: string;

    @IsNotBlank()
    cump_herminter_responsable: string;

    @IsNotBlank()
    cump_herminter_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}