import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoHospitalizacionMentalDto {
    
    @IsNotBlank()
    cump_hosp_ment_cumple: string;

    @IsNotBlank()
    cump_hosp_ment_hallazgo: string;

    @IsNotBlank()
    cump_hosp_ment_accion: string;

    @IsNotBlank()
    cump_hosp_ment_responsable: string;

    @IsNotBlank()
    cump_hosp_ment_fecha_limite: string;

}