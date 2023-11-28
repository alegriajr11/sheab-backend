import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoCuidIntermAdultoDto {
    
    @IsNotBlank()
    cump_inter_adulto_cumple: string;

    @IsNotBlank()
    cump_inter_adulto_hallazgo: string;

    @IsNotBlank()
    cump_inter_adulto_accion: string;

    @IsNotBlank()
    cump_inter_adulto_responsable: string;

    @IsNotBlank()
    cump_inter_adulto_fecha_limite: string;

}