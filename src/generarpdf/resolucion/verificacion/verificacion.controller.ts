import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { VerificacionService } from './verificacion.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ActaVerificacionDto } from './dto/acta-verificacion.dto';
import { DatosVerificadosDto } from './dto/datos-verificados.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { UsuariosSeleccionadosDto } from './dto/usuarios-seleccionados.dto';

@Controller('verificacion')
export class VerificacionController {

	constructor(private readonly acta_verificacion_Service: VerificacionService) { }


	//OBTENER TODOS LAS ACTAS SP INDEPENDIENTE
	//@UseGuards(JwtAuthGuard)
	@Get()
	getAll(@Query('tokenDto') tokenDto: string) {
		return this.acta_verificacion_Service.getAllActasVerificacion(tokenDto);
	}

	//ÚLTIMA ACTA_VERIFICACION POR TIPO DE VISITA
	@UseGuards(JwtAuthGuard)
	@Get('ultima')
	async getLastActa(@Query('tipo_visita') tipo_visita: string) {
		return this.acta_verificacion_Service.getLastActa(tipo_visita);
	}

	//LISTAR ULTIMA ACTA VERIFICACION EN GENERAL CON TODOS LOS TIPOS DE VISITA
	@Get('actas/ultima')
	async getUltimaActaVerificacion() {
		return this.acta_verificacion_Service.getLastestActa();
	}

	//SOLICITUTD LISTAR ACTA POR SU ID
	@UseGuards(JwtAuthGuard)
	@Get('lista/acta/:id')
	async getOne(@Param('id', ParseIntPipe) id: number) {
		return await this.acta_verificacion_Service.findByActa(id);
	}

	//SOLICITUD LISTAR LOS USUARIOS ASIGNADOS DEL ACTA POR ID DE ACTA
	@UseGuards(JwtAuthGuard)
	@Get('/listar/acta/usuario/:id')
	async listarUsuarioAsignado(@Param('id', ParseIntPipe) id: number) {
		return await this.acta_verificacion_Service.listarTodosLosUsuariosPorIdDeActa(id);
	}

	//CREAR ACTA - VERIFICACION
	@Post()
	async create(@Body() payloads: {
		dto_acta: ActaVerificacionDto, dto_verificados: DatosVerificadosDto,
		dto_usuarios_seleccionados: UsuariosSeleccionadosDto, tokenDto: TokenDto
	}) {
		const { dto_acta, dto_verificados, dto_usuarios_seleccionados, tokenDto } = payloads;
		return this.acta_verificacion_Service.create(payloads);
	}
}
