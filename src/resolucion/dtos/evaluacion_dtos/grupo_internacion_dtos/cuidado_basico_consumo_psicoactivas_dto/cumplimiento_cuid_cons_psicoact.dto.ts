import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoConsumoPsicoactivasDto {
    
    @IsNotBlank()
    cump_cons_psic_cumple: string;

    @IsNotBlank()
    cump_cons_psic_hallazgo: string;

    @IsNotBlank()
    cump_cons_psic_accion: string;

    @IsNotBlank()
    cump_cons_psic_responsable: string;

    @IsNotBlank()
    cump_cons_psic_fecha_limite: string;

}