import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriteriosHospPacienteCronicoService } from './criterios_hosp_paciente_cronico.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CriterioHospitCronicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_paciente_cronico_dto/criterio_hosp_paciente_cron.dto';
import { RolesGuard } from 'src/guards/rol.guard';
import { TokenDto } from 'src/auth/dto/token.dto';

@Controller('criterios-hosp-paciente-cronico')
export class CriteriosHospPacienteCronicoController {
    constructor(
        private readonly criteriosHospPacienteCronicoService: CriteriosHospPacienteCronicoService) { }

    //OBTENER CRITERIO HOSPITALIZACION PACIENTE CRONICO  POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneCriterio(@Param('id', ParseIntPipe) id: number) {
        return await this.criteriosHospPacienteCronicoService.getCriterioForEstandar(id)
    }

    //LISTAR TODOS CRITERIOS
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.criteriosHospPacienteCronicoService.getall();
    }


    //CREAR CRITERIO HOSPITALIZACION PACIENTE CRONICO POR ESTANDAR
    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async create(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHospitCronicoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return this.criteriosHospPacienteCronicoService.create(id, payload);
    }

    //ELIMINAR CRITERIO HOSPITALIZACION PACIENTE CRONICO
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteEstandar(@Param('id', ParseIntPipe) id: number, tokenDto: TokenDto) {
        return await this.criteriosHospPacienteCronicoService.delete(id, tokenDto);
    }

    //ACTUALIZAR UN CRITERIO HOSPITALIZACION PACIENTE CRONICO
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true, transformOptions: { enableImplicitConversion: true } }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: { dto: CriterioHospitCronicoDto, tokenDto: TokenDto }) {
        const { dto, tokenDto } = payload;
        return await this.criteriosHospPacienteCronicoService.update(id, payload);
    }
}
