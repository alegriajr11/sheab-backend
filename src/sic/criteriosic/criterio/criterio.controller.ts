import { Controller, Param, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioService } from './criterio.service';

@Controller('criterio')
export class CriterioController {

    constructor(private readonly criterioService: CriterioService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: string){
        return await this.criterioService.findByIndicador(id);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.criterioService.getall();
    }
}
