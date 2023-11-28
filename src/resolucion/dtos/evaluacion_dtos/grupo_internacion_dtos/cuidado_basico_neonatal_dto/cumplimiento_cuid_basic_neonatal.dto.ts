import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoCuidBasNeonatalDto {
    
    @IsNotBlank()
    cump_cui_neona_cumple: string;

    @IsNotBlank()
    cump_cui_neona_hallazgo: string;

    @IsNotBlank()
    cump_cui_neona_accion: string;

    @IsNotBlank()
    cump_cui_neona_responsable: string;

    @IsNotBlank()
    cump_cui_neona_fecha_limite: string;

}