/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { TipoService } from './tipo.service';

@Controller('tipo')
export class TipoController {
    constructor(private readonly tipoService: TipoService){}

    // @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(){
        return await this.tipoService.getall()
    }

}
