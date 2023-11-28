/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ClaseService } from './clase.service';

@Controller('clase')
export class ClaseController {
    constructor(private readonly claseService: ClaseService){}
    
    // @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(){
        return await this.claseService.getall()
    }

}
