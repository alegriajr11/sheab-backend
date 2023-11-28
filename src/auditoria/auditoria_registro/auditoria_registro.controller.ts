import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditoriaRegistroService } from './auditoria_registro.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('auditoria-registro')
export class AuditoriaRegistroController {

	//{"statusCode":404,"message":"Cannot GET /auditoria-registro/all/auditorias/list","error":"Not Found"}

	constructor(
        private readonly auditoriaRegistroService: AuditoriaRegistroService
    ) { }

	@Get('/all/auditorias/list')
    getAll() {
        return this.auditoriaRegistroService.getAllAuditorias();
    }

    @UseGuards(JwtAuthGuard)
    @Get('funcionario')
    async getAudtioriaNomApe(@Query('usu_nombre_apellido') usu_nombre_apellido: string) {
        return await this.auditoriaRegistroService.findAllAuditoriaNomApel(usu_nombre_apellido);
    }

    //OBTENER ACTAS POR FECHA O ACCIÓN
    @Get('/fecha/date')
    async findAllFromDate(@Query('fechaInicio') fechaInicio: Date,
        @Query('fechaFin') fechaFin: Date,
        @Query('accion') accion: string) {
        return this.auditoriaRegistroService.findAllFromDate(fechaInicio,fechaFin,accion);
    }

    @UseGuards(JwtAuthGuard)
    @Get('all/auditorias/list')
    async getAudtiorias() {
        return await this.auditoriaRegistroService.getAllAuditorias()
    }
}
