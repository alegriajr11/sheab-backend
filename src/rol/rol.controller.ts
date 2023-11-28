/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { RolService } from './rol.service';

@Controller('rol')
export class RolController {

    constructor(private readonly rolService: RolService){}

    @Get()
    getAll(){
        return this.rolService.getall();
    }
    
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.rolService.findById(id);
    }

    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post()
    create(@Body() dto: CreateRolDto){
        return this.rolService.create(dto)
    }
}
