import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { MessageDto } from 'src/common/message.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioPamDto } from 'src/usuario/dto/Pamec/criteriopam.dto';
import { CriteriopamService } from './criteriopam.service';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criteriopam')
export class CriteriopamController {

    constructor(private readonly criteriopamService: CriteriopamService) {
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriopamService.findByAct(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return await this.criteriopamService.getall()
    }


    @UseGuards(JwtAuthGuard)
    @Get('criterio/:id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriopamService.findByCri(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('actividad/:id')
    async getOneActividad(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriopamService.findAct(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriopamService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CriterioPamDto) {
        return await this.criteriopamService.update(id, dto);
    }

    // @UsePipes(new ValidationPipe({ whitelist: true }))
    // @Post(':id')
    // async create(@Param('id', ParseIntPipe) id: number, @Body()payloads: { dto: CriterioPamDto, tokenDto: TokenDto}) {
    //     const { dto, tokenDto } = payloads;
    //     return this.criteriopamService.create(id, payloads);
    // }

    //LISTAR TODOS LOS CRITERIOS CON EVALUACION 
    @Get('cripam/pamec')
    async getAllcriterio() {
        return await this.criteriopamService.getallcriterio()
    }


}
