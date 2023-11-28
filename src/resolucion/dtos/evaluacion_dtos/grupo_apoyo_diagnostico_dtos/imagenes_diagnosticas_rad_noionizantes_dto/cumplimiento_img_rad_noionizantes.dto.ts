import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoImgRadNoIonizantesDto {

    @IsNotBlank()
    cump_img_noion_cumple: string;

    @IsNotBlank()
    cump_img_noion_hallazgo: string;

    @IsNotBlank()
    cump_img_noion_accion: string;

    @IsNotBlank()
    cump_img_noion_responsable: string;

    @IsNotBlank()
    cump_img_noion_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}