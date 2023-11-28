import { Controller, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { IndicadorService } from './indicador.service';

@Controller('indicador')
export class IndicadorController {

    constructor(private readonly indicadorService: IndicadorService) {
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: number){
        return await this.indicadorService.findByDominio(id);
    }
    @UseGuards(JwtAuthGuard)
    @Get('/ind/:id')
    async getInd(@Param('id') id: string){
        return await this.indicadorService.findById(id);
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(){
        return await this.indicadorService.getall();
    }
}
