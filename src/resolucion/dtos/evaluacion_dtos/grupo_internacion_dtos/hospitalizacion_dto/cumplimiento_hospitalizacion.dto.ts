import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoHospitalizacionDto {
    
    @IsNotBlank()
    cump_hosp_cumple: string;

    @IsNotBlank()
    cump_hosp_hallazgo: string;

    @IsNotBlank()
    cump_hosp_accion: string;

    @IsNotBlank()
    cump_hosp_responsable: string;

    @IsNotBlank()
    cump_hosp_fecha_limite: string;

}