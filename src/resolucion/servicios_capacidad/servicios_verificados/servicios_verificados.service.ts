import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ServiciosVerificadosEntity } from '../servicios_verificados.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiciosVerificadosRepository } from '../servicios_verificados.repository';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { PrestadorRepository } from 'src/prestador/prestador.repository';
import { MessageDto } from 'src/common/message.dto';
import { ServiciosVerificadosDto } from 'src/resolucion/dtos/servicios_capacidad_dto/servicios_verificados.dto';
import { GrupoEvaluacionEntity } from 'src/resolucion/grupo_evaluacion/grupo_evaluacion.entity';
import { GrupoEvaluacionRepository } from 'src/resolucion/grupo_evaluacion/grupo_evaluacion.repository';

@Injectable()
export class ServiciosVerificadosService {
    constructor(
        @InjectRepository(ServiciosVerificadosEntity)
        private readonly serviciosVerificadosRepository: ServiciosVerificadosRepository,
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
        @InjectRepository(GrupoEvaluacionEntity)
        private readonly grupoEvaluacionRepository: GrupoEvaluacionRepository,
    ) { }

    //LISTANDO SERVICIOS POR PRESTADOR
    async getServicioForPrestador(id: string): Promise<ServiciosVerificadosEntity[]> {
        const servicio_prestador = await this.serviciosVerificadosRepository.createQueryBuilder('servicio')
            .select(['servicio', 'prestadores.pre_nombre'])
            .innerJoin('servicio.prestadores', 'prestadores')
            .innerJoinAndSelect('servicio.grup_evaluacion', 'grup_evaluacion')
            .where('prestadores.pre_cod_habilitacion = :servi_pres', { servi_pres: id })
            .getMany()
        if (!servicio_prestador) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return servicio_prestador
    }

    //METODO AGREGAR SERVICIO
    async create(pre_cod_habilitacion: string, dto: ServiciosVerificadosDto): Promise<any> {
        const servicio_prestador = await this.prestadorRepository.findOne({ where: { pre_cod_habilitacion: pre_cod_habilitacion } });
        if (!servicio_prestador) throw new InternalServerErrorException(new MessageDto('El Prestador no ha sido creado'))

        // SE BUSCA EL GRUPO EVALUACION QUE SE ASIGNA AL SERVICIO
        const grupo_id = await this.grupoEvaluacionRepository.findOne({ where: { id: dto.ser_grupo_eva_id } });
        if (!grupo_id) {
            throw new Error('El grupo no ha sido creado');
        }

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const servicioverificado = this.serviciosVerificadosRepository.create(dto)

         // ASIGNAMOS LA FORANEA DE SERVICIO  CON prestador
        servicioverificado.prestadores =servicio_prestador ;
        // ASIGNAMOS LA FORANEA DE SERVICIO  CON GRUPO_ID
        servicioverificado.grup_evaluacion =grupo_id ;
        //GUARDAR LOS DATOS EN LA BD
        await this.serviciosVerificadosRepository.save(servicioverificado)
        return new MessageDto('La capacidad ha sido Creada Correctamente');
    }

    //ENCONTRAR POR ID - CAPACIDAD INSTALADA
    async findById(ser_id: number): Promise<ServiciosVerificadosEntity> {
        const servi_verificada = await this.serviciosVerificadosRepository.findOne({ where: { ser_id } });
        if (!servi_verificada) {
            throw new NotFoundException(new MessageDto('el servicio No Existe'));
        }
        return servi_verificada;
    }

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const servi_verificada = await this.findById(id);
        await this.serviciosVerificadosRepository.delete(servi_verificada.ser_id)
        return new MessageDto(`Servicio Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateservico(id: number, dto: ServiciosVerificadosDto): Promise<any> {
        const servicio_verificada = await this.findById(id);
        if (!servicio_verificada) {
            throw new NotFoundException(new MessageDto('El servicio no existe'))
        }
        dto.ser_codigo ? servicio_verificada.ser_codigo = dto.ser_codigo : servicio_verificada.ser_codigo = servicio_verificada.ser_codigo;
        dto.ser_nombre ? servicio_verificada.ser_nombre = dto.ser_nombre : servicio_verificada.ser_nombre = servicio_verificada.ser_nombre;
        dto.ambulatorio ? servicio_verificada.ambulatorio = dto.ambulatorio : servicio_verificada.ambulatorio = servicio_verificada.ambulatorio;
        dto.hospitalario ? servicio_verificada.hospitalario = dto.hospitalario : servicio_verificada.hospitalario = servicio_verificada.hospitalario;
        dto.unidad_movil ? servicio_verificada.unidad_movil = dto.unidad_movil : servicio_verificada.unidad_movil = servicio_verificada.unidad_movil;
        dto.domiciliario ? servicio_verificada.domiciliario = dto.domiciliario : servicio_verificada.domiciliario = servicio_verificada.domiciliario;
        dto.otras_extramural ? servicio_verificada.otras_extramural = dto.otras_extramural : servicio_verificada.otras_extramural = servicio_verificada.otras_extramural;
        dto.centro_referencia ? servicio_verificada.centro_referencia = dto.centro_referencia : servicio_verificada.centro_referencia = servicio_verificada.centro_referencia;
        dto.institucion_remisora ? servicio_verificada.institucion_remisora = dto.institucion_remisora : servicio_verificada.institucion_remisora = servicio_verificada.institucion_remisora;
        dto.complejidad_baja ? servicio_verificada.complejidad_baja = dto.complejidad_baja : servicio_verificada.complejidad_baja = servicio_verificada.complejidad_baja;
        dto.complejidad_media ? servicio_verificada.complejidad_media = dto.complejidad_media : servicio_verificada.complejidad_media = servicio_verificada.complejidad_media;
        dto.complejidad_alta ? servicio_verificada.complejidad_alta = dto.complejidad_alta : servicio_verificada.complejidad_alta = servicio_verificada.complejidad_alta;
        await this.serviciosVerificadosRepository.save(servicio_verificada);

        return new MessageDto(`El servicio ha sido Actualizado`);

    }
}
