import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoEspecializadaDto {
    
    @IsNotBlank()
    cump_exte_cumple: string;

    @IsNotBlank()
    cump_exte_hallazgo: string;

    @IsNotBlank()
    cump_exte_accion: string;

    @IsNotBlank()
    cump_exte_responsable: string;

    @IsNotBlank()
    cump_exte_fecha_limite: string;

}