/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, MaxLength, ValidationArguments} from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";


export class CalificacionAjusteDto {
    
    @IsNotEmpty({ message: 'Es obligatorio asignar una calificación' })
    @IsNumber({}, { message: (args: ValidationArguments) => {
        if (typeof args.value !== 'undefined') {
            return 'La calificación debe ser un número';
        }
        return 'Es obligatorio asignar una calificación';
    }})
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