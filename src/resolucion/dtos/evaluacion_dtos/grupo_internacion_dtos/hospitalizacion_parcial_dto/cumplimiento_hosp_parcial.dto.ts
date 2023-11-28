import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoHospitalizacionParcialDto {
    
    @IsNotBlank()
    cump_hosp_parc_cumple: string;

    @IsNotBlank()
    cump_hosp_parc_hallazgo: string;

    @IsNotBlank()
    cump_hosp_parc_accion: string;

    @IsNotBlank()
    cump_hosp_parc_responsable: string;

    @IsNotBlank()
    cump_hosp_parc_fecha_limite: string;

}