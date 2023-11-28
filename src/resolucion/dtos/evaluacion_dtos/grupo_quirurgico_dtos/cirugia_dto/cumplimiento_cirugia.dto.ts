import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoCirugiaDto {
    
    @IsNotBlank()
    cump_ciru_cumple: string;

    @IsNotBlank()
    cump_ciru_hallazgo: string;

    @IsNotBlank()
    cump_ciru_accion: string;

    @IsNotBlank()
    cump_ciru_responsable: string;

    @IsNotBlank()
    cump_ciru_fecha_limite: string;

}