import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoPrehospitalariaDto {
    
    @IsNotBlank()
    cump_preh_cumple: string;

    @IsNotBlank()
    cump_preh_hallazgo: string;

    @IsNotBlank()
    cump_preh_accion: string;

    @IsNotBlank()
    cump_preh_responsable: string;

    @IsNotBlank()
    cump_preh_fecha_limite: string;

}