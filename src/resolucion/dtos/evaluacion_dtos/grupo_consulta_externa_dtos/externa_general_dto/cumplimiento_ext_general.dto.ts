import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoExternaGeneralDto{
    
    @IsNotBlank()
    cump_extg_cumple: string;

    @IsNotBlank()
    cump_extg_hallazgo: string;

    @IsNotBlank()
    cump_extg_accion: string;

    @IsNotBlank()
    cump_extg_responsable: string;

    @IsNotBlank()
    cump_extg_fecha_limite: string;

}