import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoVacunacionDto {
    
    @IsNotBlank()
    cump_vac_cumple: string;

    @IsNotBlank()
    cump_vac_hallazgo: string;

    @IsNotBlank()
    cump_vac_accion: string;

    @IsNotBlank()
    cump_vac_responsable: string;

    @IsNotBlank()
    cump_vac_fecha_limite: string;

}