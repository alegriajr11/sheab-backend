import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class RequestResetPasswordDTO {
    @IsNotBlank({message: 'El id no puede estar vacio'})
    usu_id: number;
}