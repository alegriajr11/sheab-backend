import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoCuidInteNeonatalDto {
    
    @IsNotBlank()
    cump_int_neon_cumple: string;

    @IsNotBlank()
    cump_int_neon_hallazgo: string;

    @IsNotBlank()
    cump_int_neon_accion: string;

    @IsNotBlank()
    cump_int_neon_responsable: string;

    @IsNotBlank()
    cump_int_neon_fecha_limite: string;

}