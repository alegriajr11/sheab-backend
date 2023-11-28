import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActaVerificacionEntity } from './acta-verificacion.entity';
import { ActaCerificacionRepository } from './acta-verificacion.repository';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { PrestadorRepository } from 'src/prestador/prestador.repository';
import { MessageDto } from 'src/common/message.dto';
import { retry } from 'rxjs';
import { ActaVerificacionDto } from './dto/acta-verificacion.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/auth/payload.interface';
import { DatosVerificadosDto } from './dto/datos-verificados.dto';
import { DatosVisitVErificadoEntity } from '../visita-verificacion/datos-visit-verificado.entity';
import { DatosVerificadosRepository } from '../visita-verificacion/datos-visit-verificado.repository';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';
import { EvaluacionResolucionVerificacionDto } from 'src/resolucion/dtos/evaluacion_verificacion_acta/evaluacion_verificacion.dto';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { UsuariosSeleccionadosDto } from './dto/usuarios-seleccionados.dto';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioRepository } from 'src/usuario/usuario.repository';
import { UsuarioDto } from 'src/usuario/dto/usuario.dto';

@Injectable()
export class VerificacionService {

	constructor(
		@InjectRepository(ActaVerificacionEntity)
		private readonly acta_verificacion_pdfRepository: ActaCerificacionRepository,
		@InjectRepository(PrestadorEntity)
		private readonly prestadorRepository: PrestadorRepository,
		@InjectRepository(DatosVisitVErificadoEntity)
		private readonly datosverificadosRepository: DatosVerificadosRepository,
		@InjectRepository(EvaluacionResVerificacionEntity)
		private readonly evaluacionVerificacionRepository: EvaluacionResVerificacionRepository,
		@InjectRepository(UsuarioEntity)
		private readonly usuarioRepository: UsuarioRepository,
		private readonly jwtService: JwtService,
		private readonly auditoria_registro_services: AuditoriaRegistroService,
	) { }


	//LISTAR TODOS LOS USUARIOS QUE TIENEN ASIGNADA EL ID DEL ACTA
	async listarTodosLosUsuariosPorIdDeActa(id_acta: number): Promise<UsuarioEntity[]> {
		try {
			const acta_usuarios = await this.usuarioRepository
				.createQueryBuilder('usuarios')
				.innerJoinAndSelect('usuarios.usuario_verificacion','usuario_verificacion')
				.where("usuario_verificacion.id= :id",{ id: id_acta })
				.getMany()

				if(!acta_usuarios){
					throw new NotFoundException(new MessageDto('No Hay Usuarios'));
				}

			return acta_usuarios;
		} catch (error) {
			console.error('Error al obtener los usuarios del acta asignada:', error);
			return undefined;
		}
	}


	//LISTAR TODAS LAS ACTAS DE VERIFICACION
	async getAllActasVerificacion(tokenDto: string): Promise<ActaVerificacionEntity[]> {
		const usuario = await this.jwtService.decode(tokenDto);

		const payloadInterface: PayloadInterface = {
			usu_id: usuario[`usu_id`],
			usu_nombre: usuario[`usu_nombre`],
			usu_apellido: usuario[`usu_apellido`],
			usu_nombreUsuario: usuario[`usu_nombreUsuario`],
			usu_email: usuario[`usu_email`],
			usu_estado: usuario[`usu_estado`],
			usu_roles: usuario[`usu_roles`]
		};

		if (!payloadInterface.usu_roles.includes('admin')) {
			const acta = await this.acta_verificacion_pdfRepository.createQueryBuilder('acta_verificacion')
				.select(['acta_verificacion'])
				.innerJoinAndSelect('acta_verificacion.verificacion_usuario', 'verificacion_usuario')
				.where('verificacion_usuario.usu_id = :id_usuario', { id_usuario: payloadInterface.usu_id })
				.orderBy("CASE WHEN acta_verificacion.act_estado = '1' THEN 0 ELSE 1 END, acta_verificacion.act_estado")
				.getMany()
			if (acta.length === 0) throw new NotFoundException(new MessageDto('No tienes evaluaciones asignadas'))
			return acta;
		} else {
			const acta = await this.acta_verificacion_pdfRepository.createQueryBuilder('acta_verificacion')
				.select(['acta_verificacion'])
				.orderBy("CASE WHEN acta_verificacion.act_estado = '1' THEN 0 ELSE 1 END, acta_verificacion.act_estado")
				.getMany()
			if (acta.length === 0) throw new NotFoundException(new MessageDto('No hay evaluaciones asignadas'))
			return acta;
		}
	}

	//LISTAR ACTA POR ID
	async findByActa(id: number): Promise<ActaVerificacionEntity> {
		const acta_verificacion = await this.acta_verificacion_pdfRepository.findOne({ where: { id } });
		if (!acta_verificacion) {
			throw new NotFoundException(new MessageDto('No Existe'));
		}
		return acta_verificacion;
	}

	//LISTAR ULTIMO ACTA_ID POR TIPO DE VISITA
	async getLastActa(tipo_visita: string): Promise<ActaVerificacionEntity> {
		const anioActual: number = new Date().getFullYear();

		if (tipo_visita === 'previa') {
			const actaPrevia = await this.acta_verificacion_pdfRepository.createQueryBuilder('acta_previa')
				.select('acta_previa')
				.where('acta_previa.act_visita_previa LIKE :valor', { valor: '%X%' })
				.orderBy('acta_previa.act_id', 'DESC')
				.getOne();

			if (!actaPrevia) {
				// Si no existe acta previa
				const newActaPrevia = new ActaVerificacionEntity();
				newActaPrevia.act_id = 1;
				return newActaPrevia;
			}

			if (actaPrevia) {
				actaPrevia.act_creado = new Date(actaPrevia.act_creado);
				if (actaPrevia.act_creado.getFullYear() === anioActual) {
					actaPrevia.act_id++;
				} else {
					actaPrevia.act_id = 1;
				}
				return actaPrevia;
			}
		}

		if (tipo_visita === 'seguimiento') {
			const actaSeguimiento = await this.acta_verificacion_pdfRepository.createQueryBuilder('acta_seguimiento')
				.select('acta_seguimiento')
				.where('acta_seguimiento.act_visita_seguimiento LIKE :valor', { valor: '%X%' })
				.orderBy('acta_seguimiento.act_id', 'DESC')
				.getOne();

			if (!actaSeguimiento) {
				// Si no existe acta Seguimiento (CERTIFICACION)
				const newActaSeguimiento = new ActaVerificacionEntity();
				newActaSeguimiento.act_id = 1;
				return newActaSeguimiento;
			}

			if (actaSeguimiento) {
				actaSeguimiento.act_creado = new Date(actaSeguimiento.act_creado);
				if (actaSeguimiento.act_creado.getFullYear() === anioActual) {
					actaSeguimiento.act_id++;
				} else {
					actaSeguimiento.act_id = 1;
				}
				return actaSeguimiento;
			}
		}
		if (tipo_visita === 'reactivacion') {
			const actaReactivacion = await this.acta_verificacion_pdfRepository.createQueryBuilder('acta_reactivacion')
				.select('acta_reactivacion')
				.where('acta_reactivacion.act_visita_reactivacion LIKE :valor', { valor: '%X%' })
				.orderBy('acta_reactivacion.act_id', 'DESC')
				.getOne();

			if (!actaReactivacion) {
				// Si no existe acta reactivacion
				const newActaReactivacion = new ActaVerificacionEntity();
				newActaReactivacion.act_id = 1;
				return newActaReactivacion;
			}

			if (actaReactivacion) {
				actaReactivacion.act_creado = new Date(actaReactivacion.act_creado);
				if (actaReactivacion.act_creado.getFullYear() === anioActual) {
					actaReactivacion.act_id++;
				} else {
					actaReactivacion.act_id = 1;
				}
				return actaReactivacion;
			}
		}

	}

	//ÚLTIMA ACTA REGISTRADA ALL
	async getLastestActa(): Promise<ActaVerificacionEntity | undefined> {
		try {
			const ultimaActaId = await this.acta_verificacion_pdfRepository
				.createQueryBuilder('acta')
				.select('MAX(acta.act_id)', 'maxId')
				.getRawOne();

			if (!ultimaActaId || !ultimaActaId.maxId) {
				return undefined; // No hay actas en la base de datos
			}

			const ultimaActa = await this.acta_verificacion_pdfRepository
				.createQueryBuilder('acta')
				.where('acta.act_id = :maxId', { maxId: ultimaActaId.maxId })
				.getOne();

			return ultimaActa;
		} catch (error) {
			console.error('Error al obtener la última acta:', error);
			return undefined;
		}
	}





	//CONSULTA CREAR UN ACTA VERIFICACIÓN
	async create(payloads: {
		dto_acta: ActaVerificacionDto, dto_verificados: DatosVerificadosDto,
		dto_usuarios_seleccionados: UsuariosSeleccionadosDto, tokenDto: TokenDto
	}): Promise<any> {

		const { dto_acta, dto_verificados, dto_usuarios_seleccionados, tokenDto } = payloads;

		try {
			const acta_verificacion = this.acta_verificacion_pdfRepository.create(dto_acta)
			const usuario = await this.jwtService.decode(tokenDto.token);

			const payloadInterface: PayloadInterface = {
				usu_id: usuario[`usu_id`],
				usu_nombre: usuario[`usu_nombre`],
				usu_apellido: usuario[`usu_apellido`],
				usu_nombreUsuario: usuario[`usu_nombreUsuario`],
				usu_email: usuario[`usu_email`],
				usu_estado: usuario[`usu_estado`],
				usu_roles: usuario[`usu_roles`]
			};

			const year = new Date().getFullYear().toString();

			await this.acta_verificacion_pdfRepository.save(acta_verificacion)

			const acta_ultima_verificacion = await this.acta_verificacion_pdfRepository.createQueryBuilder('acta')
				.addSelect('acta.id')
				.orderBy('acta.id', 'DESC')
				.getOne();

			//CONSULTAR LA ULTIMA ACTA QUE SE ASIGNARA A LA ENTIDAD DATOS ENCONTRADOS
			const acta = await this.acta_verificacion_pdfRepository.findOne({ where: { id: acta_ultima_verificacion.id } })

			//CREAMOS EL DTO ENVIADO POR PARAMETRO Y ASIGNAMOS LA RELACIÓN CON LA ACTA CREADA
			const datos_verificados = this.datosverificadosRepository.create(dto_verificados)

			//ASIGNACION DE LA RELACION DE DATOS VERIFICADOS CON ACTA
			datos_verificados.acta_verificacion_datos_encontrados = acta

			//GUARDAR EN LA ENTIDAD DATOS-VERIFICADOS
			await this.datosverificadosRepository.save(datos_verificados)

			const eva_creado = acta_ultima_verificacion.act_creado;  //Fecha de creación del acta
			const eva_acta_prestador = acta_ultima_verificacion.act_cod_habilitacion; // Valor del ID del prestador

			//CONSULTAR EL PRESTADOR QUE TIENE EL ACTA
			const prestador = await this.prestadorRepository.findOne({ where: { pre_cod_habilitacion: eva_acta_prestador } })

			//ASIGNAMOS LOS DATOS AL DTO EVALUACION-VERIFICACION
			const evaluacionDto: EvaluacionResolucionVerificacionDto = {
				eva_creado
			}

			//CREAMOS EL DTO EVALUACION_VERIFICACION
			const evaluacion_verificacion = await this.evaluacionVerificacionRepository.create(evaluacionDto)

			//ASIGNACION DE FORANEA ACTA UNO A UNO
			evaluacion_verificacion.eval_acta_veri = acta
			//ASIGNACION DE FORANEA PRESTADOR UNO A MUCHOS
			evaluacion_verificacion.eval_verificacion_prestador = prestador

			//GUARDAMOS EN LA ENTIDAD EVALUACION-VERIFICACION DE LA BASE DATOS
			await this.evaluacionVerificacionRepository.save(evaluacion_verificacion)

			//CREACION DEL DTO DE USUARIOS VERIFICADORES
			const usuario_verificadores = this.usuarioRepository.create(dto_usuarios_seleccionados);

			//Obtener los usuarios basados en sus IDs
			const usuariosAsignados = await this.usuarioRepository.findByIds(Object.values(dto_usuarios_seleccionados));


			// Asignar la relación ManyToMany
			acta.verificacion_usuario = usuariosAsignados;

			// Guardar la relación ManyToMany en la base de datos
			await this.acta_verificacion_pdfRepository.save(acta);


			//ASIGNAR LA AUDITORIA DEL ACTA CREADA
			await this.auditoria_registro_services.logCreateActaVerificacion(
				payloadInterface.usu_nombre,
				payloadInterface.usu_apellido,
				'ip',
				dto_acta.act_id,
				year,
				dto_acta.act_prestador,
				dto_acta.act_cod_habilitacion
			);

			return { error: false, message: 'El acta ha sido creada' };

		} catch (error) {
			return { error: true, message: 'Error al crear el acta. Por favor, inténtelo de nuevo.' };
		}
	}


	
}
