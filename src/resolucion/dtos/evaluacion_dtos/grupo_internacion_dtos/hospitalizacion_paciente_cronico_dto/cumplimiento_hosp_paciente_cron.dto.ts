import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoHospitCronicoDto {
    
    @IsNotBlank()
    cump_hosp_cron_cumple: string;

    @IsNotBlank()
    cump_hosp_cron_hallazgo: string;

    @IsNotBlank()
    cump_hosp_cron_accion: string;

    @IsNotBlank()
    cump_hosp_cron_responsable: string;

    @IsNotBlank()
    cump_hosp_cron_fecha_limite: string;

}