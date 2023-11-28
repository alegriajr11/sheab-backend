import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoDialisisDto {
    
    @IsNotBlank()
    cump_dial_cumple: string;

    @IsNotBlank()
    cump_dial_hallazgo: string;

    @IsNotBlank()
    cump_dial_accion: string;

    @IsNotBlank()
    cump_dial_responsable: string;

    @IsNotBlank()
    cump_dial_fecha_limite: string;

}