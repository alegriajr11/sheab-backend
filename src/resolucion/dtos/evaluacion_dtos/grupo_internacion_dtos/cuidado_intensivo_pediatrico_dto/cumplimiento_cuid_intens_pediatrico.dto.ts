import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoCuidIntePediatricoDto {
    
    @IsNotBlank()
    cump_int_ped_cumple: string;

    @IsNotBlank()
    cump_int_ped_hallazgo: string;

    @IsNotBlank()
    cump_int_ped_accion: string;

    @IsNotBlank()
    cump_int_ped_responsable: string;

    @IsNotBlank()
    cump_int_ped_fecha_limite: string;

}