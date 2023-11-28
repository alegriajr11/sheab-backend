import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ServicioEntity } from './servicio.entity';
import { ServicioRepository } from './servicio.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ServiciosnDto } from '../dtos/servicios/servicios.dto';
import { GrupoEvaluacionEntity } from '../grupo_evaluacion/grupo_evaluacion.entity';
import { GrupoEvaluacionRepository } from '../grupo_evaluacion/grupo_evaluacion.repository';

@Injectable()
export class ServicioService {
    constructor(
        @InjectRepository(ServicioEntity)
        private readonly servicioRepository: ServicioRepository,
        @InjectRepository(GrupoEvaluacionEntity)
        private readonly grupoEvaluacionRepository: GrupoEvaluacionRepository
    ) { }

    async getall(): Promise<ServicioEntity[]> {
        const criterio = await this.servicioRepository.createQueryBuilder('servicio')
            .select(['servicio'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay evaluaciones  en la lista'))
        return criterio;
    }

    async create(id: number, dto: ServiciosnDto): Promise<any> {
        const evaluacion = await this.grupoEvaluacionRepository.findOne({ where: { id: id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'))
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const servicio = this.servicioRepository.create(dto)
        //ASIGNAMOS EL ESTANDAR AL CRITERIO
        servicio.evaluacion_servicios = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.servicioRepository.save(servicio)
        return new MessageDto('El servicio ha sido Creado Correctamente');
    }

    //ENCONTRAR POR ID - CRITERIO PRETANSFUNCIONAL
    async findById(id: number): Promise<ServicioEntity> {
        const servicio = await this.servicioRepository.findOne({ where: { id } });
        if (!servicio) {
            throw new NotFoundException(new MessageDto('El servicio No Existe'));
        }
        return servicio;
    }

    //ELIMINAR CRITERIO PRETANSFUNCIONAL
    async delete(id: number): Promise<any> {
        const evaluacion = await this.findById(id);
        await this.servicioRepository.delete(id)
        return new MessageDto(`Servicio Eliminado`);
    }

    //ACTUALIZAR CRITERIOS PRETRANSFUNSIONAL
    async updateGestion(id: number, dto: ServiciosnDto): Promise<any> {
        const servicio = await this.findById(id);
        if (!servicio) {
            throw new NotFoundException(new MessageDto('El criterio no existe'))
        }
        dto.nombre ? servicio.nombre = dto.nombre : servicio.nombre = servicio.nombre;

        await this.servicioRepository.save(servicio);

        return new MessageDto(`El servicio ha sido Actualizado`);

    }
}
