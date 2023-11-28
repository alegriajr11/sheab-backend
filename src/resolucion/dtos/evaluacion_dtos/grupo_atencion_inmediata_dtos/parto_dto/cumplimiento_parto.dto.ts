import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoPartoDto {
    
    @IsNotBlank()
    cump_parto_cumple: string;

    @IsNotBlank()
    cump_parto_hallazgo: string;

    @IsNotBlank()
    cump_parto_accion: string;

    @IsNotBlank()
    cump_parto_responsable: string;

    @IsNotBlank()
    cump_parto_fecha_limite: string;

}