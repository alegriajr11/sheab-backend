import { IsNumber, IsOptional, IsString } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CumplimientoServiciosDto {
    
    @IsNotBlank()
    @IsString()
    cumps_cumple: string;

    @IsOptional()
    @IsString()
    cumps_hallazgo: string;

    @IsNumber()
    cris_id: number

    @IsNumber()
    eva_ver_id: number
}