/* eslint-disable prettier/prettier */
import { IsNumber, IsString, MaxLength} from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CalificacionPlaneacionDto {
    
    @IsNumber()
    cal_nota: number;

    @IsString()
    @MaxLength(255, {message: 'La observacion debe tener: longitud máxima de 255 caracteres'})
    cal_observaciones: string

    @IsNumber()
    cri_ips_id: number;
    
    @IsNumber()
    eva_ips_id: number;
    
    @IsNumber()
    acta_ips: number;

}