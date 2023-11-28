import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoCuidIntensAdultoDto {
    
    @IsNotBlank()
    cump_cui_int_adul_cumple: string;

    @IsNotBlank()
    cump_cui_int_adul_hallazgo: string;

    @IsNotBlank()
    cump_cui_int_adul_accion: string;

    @IsNotBlank()
    cump_cui_int_adul_responsable: string;

    @IsNotBlank()
    cump_cui_int_adul_fecha_limite: string;

}