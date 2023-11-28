import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoTranspAsistencialDto{
    
    @IsNotBlank()
    cump_trans_asis_cumple: string;

    @IsNotBlank()
    cump_trans_asis_hallazgo: string;

    @IsNotBlank()
    cump_trans_asis_accion: string;

    @IsNotBlank()
    cump_trans_asis_responsable: string;

    @IsNotBlank()
    cump_trans_asis_fecha_limite: string;

}