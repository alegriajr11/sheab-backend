import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ItemipsService } from './itemips.service';

@Controller('itemips')
export class ItemipsController {

    constructor(private readonly itemipsService: ItemipsService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number){
        return await this.itemipsService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.itemipsService.getall();
    }
}
