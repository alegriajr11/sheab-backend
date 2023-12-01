import { Body, Controller, Post } from '@nestjs/common';
import { DivsCreadosSicService } from './divs-creados-sic.service';
import { DivCreadoSicDto } from 'src/usuario/dto/Sic/divCreados.dto';

@Controller('divs-creados-sic')
export class DivsCreadosSicController {

    constructor(
        private readonly div_creadoSicService: DivsCreadosSicService
    ) { }

    @Post()
    async create(@Body() payload: { dto: DivCreadoSicDto }) {
        const { dto } = payload;
        return this.div_creadoSicService.createDiv(payload);
    }
}
