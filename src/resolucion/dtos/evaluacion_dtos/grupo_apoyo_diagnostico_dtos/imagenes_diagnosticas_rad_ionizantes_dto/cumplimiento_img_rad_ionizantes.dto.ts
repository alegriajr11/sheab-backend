import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoImgRadIonizantesDto {

    @IsNotBlank()
    cump_imgion_cumple: string;

    @IsNotBlank()
    cump_imgion_hallazgo: string;

    @IsNotBlank()
    cump_imgion_accion: string;

    @IsNotBlank()
    cump_imgion_responsable: string;

    @IsNotBlank()
    cump_imgion_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}