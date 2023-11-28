import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioIndDto } from 'src/usuario/dto/SpInd/criterioind.dto';
import { CriterioindService } from './criterioind.service';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterioind')
export class CriterioindController {

    constructor(private readonly criterioIndService: CriterioindService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioIndService.findByEta(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/criterio/:id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioIndService.findCri(id);
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body()payloads: { dto: CriterioIndDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payloads;
        return await this.criterioIndService.update(id, payloads);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.criterioIndService.delete(id);
    }


    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body()payloads: { dto: CriterioIndDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payloads;
        return this.criterioIndService.create(id, payloads);
    }

    //LISTAR TODOS LOS CRITERIOS CON EVALUACION 
    @Get('criid/independientes')
    async getAllcriterio() {
        return await this.criterioIndService.getallcriterio()
    }

    
}


