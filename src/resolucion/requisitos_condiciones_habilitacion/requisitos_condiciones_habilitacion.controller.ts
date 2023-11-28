import { Controller, Get } from '@nestjs/common';
import { RequisitosCondicionesHabilitacionService } from './requisitos_condiciones_habilitacion.service';

@Controller('requisitos-condiciones-habilitacion')
export class RequisitosCondicionesHabilitacionController {

    constructor(
        private readonly condiciones_habilitacionService: RequisitosCondicionesHabilitacionService
    ){}

    //SOLICITUD AL SERVICIO LISTAR TODAS LAS CODICIONES DE HABILITACIÓN
    @Get()
    getAllCondiciones() {
        return this.condiciones_habilitacionService.getAllCondiciones();
    }
}
