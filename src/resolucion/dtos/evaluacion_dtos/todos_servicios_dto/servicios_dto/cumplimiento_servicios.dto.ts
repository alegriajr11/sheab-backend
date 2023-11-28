import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoServiciosDto {
    
    @IsNotBlank()
    cumps_cumple: string;

    @IsNotBlank()
    cumps_hallazgo: string;

    @IsNotBlank()
    cumps_accion: string;

    @IsNotBlank()
    cumps_responsable: string;

    @IsNotBlank()
    cumps_fecha_limite: string;

}