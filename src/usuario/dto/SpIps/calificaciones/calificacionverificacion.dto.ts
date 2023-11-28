/* eslint-disable prettier/prettier */
import { IsNumber, IsString, MaxLength} from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CalificacionVerificacionDto {
    
    @IsNumber()
    cal_nota: number;

    @IsString()
    cal_observaciones: string

    @IsNumber()
    cri_ips_id: number;
    
    @IsNumber()
    eva_ips_id: number;
    
    @IsNumber()
    acta_ips: number;

}