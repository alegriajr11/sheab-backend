import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoCuidIntermPediatricoDto {
    
    @IsNotBlank()
    cump_inter_pedi_cumple: string;

    @IsNotBlank()
    cump_inter_pedi_hallazgo: string;

    @IsNotBlank()
    cump_inter_pedi_accion: string;

    @IsNotBlank()
    cump_inter_pedi_responsable: string;

    @IsNotBlank()
    cump_inter_pedi_fecha_limite: string;

}