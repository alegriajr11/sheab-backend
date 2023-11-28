import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoUrgenciasDto {
    
    @IsNotBlank()
    cump_urge_cumple: string;

    @IsNotBlank()
    cump_urge_hallazgo: string;

    @IsNotBlank()
    cump_urge_accion: string;

    @IsNotBlank()
    cump_urge_responsable: string;

    @IsNotBlank()
    cump_urge_fecha_limite: string;

}