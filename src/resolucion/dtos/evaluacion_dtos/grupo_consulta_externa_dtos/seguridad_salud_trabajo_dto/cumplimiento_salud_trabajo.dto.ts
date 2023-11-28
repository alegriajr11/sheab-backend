import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoSaludTrabajoDto {
    
    @IsNotBlank()
    cump_saltra_cumple: string;

    @IsNotBlank()
    cump_saltra_hallazgo: string;

    @IsNotBlank()
    cump_saltra_accion: string;

    @IsNotBlank()
    cump_saltra_responsable: string;

    @IsNotBlank()
    cump_saltra_fecha_limite: string;

}