import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoSerFarmaceuticoDto{

    @IsNotBlank()
    cump_ser_farm_cumple: string;

    @IsNotBlank()
    cump_ser_farm_hallazgo: string;

    @IsNotBlank()
    cump_ser_farm_accion: string;

    @IsNotBlank()
    cump_ser_farm_responsable: string;

    @IsNotBlank()
    cump_ser_farm_fecha_limite: string;

    // @IsNumber()
    // cri_diag_vas_id: number

    // @IsNumber()
    // eva_res_id: number
}