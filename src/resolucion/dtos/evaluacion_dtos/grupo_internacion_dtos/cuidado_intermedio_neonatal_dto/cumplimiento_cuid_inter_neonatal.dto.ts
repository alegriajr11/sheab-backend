import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoCuidIntermNeonatalDto {
    
    @IsNotBlank()
    cump_inter_neona_cumple: string;

    @IsNotBlank()
    cump_inter_neona_hallazgo: string;

    @IsNotBlank()
    cump_inter_neona_accion: string;

    @IsNotBlank()
    cump_inter_neona_responsable: string;

    @IsNotBlank()
    cump_inter_neona_fecha_limite: string;

}