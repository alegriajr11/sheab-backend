import { Injectable, NotFoundException } from '@nestjs/common';
import { GrupoEvaluacionEntity } from './grupo_evaluacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GrupoEvaluacionRepository } from './grupo_evaluacion.repository';
import { MessageDto } from 'src/common/message.dto';
import { GrupoEvaluacionDto } from '../dtos/grupo_evaluacion_dto/grupo_evaluacion.dto';

@Injectable()
export class GrupoEvaluacionService {
    constructor(
        @InjectRepository(GrupoEvaluacionEntity)
        private readonly grupoEvaluacionRepository: GrupoEvaluacionRepository,
    ) { }

    async getall(): Promise<GrupoEvaluacionEntity[]> {
        const criterio = await this.grupoEvaluacionRepository.createQueryBuilder('evaluacion')
            .select(['evaluacion'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay evaluaciones  en la lista'))
        return criterio;
    }

    //METODO AGREGAR GRUPO DE EVALUACION
    async create(dto: GrupoEvaluacionDto): Promise<any> {
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const evaluacion = this.grupoEvaluacionRepository.create(dto)
        //GUARDAR LOS DATOS EN LA BD
        await this.grupoEvaluacionRepository.save(evaluacion)
        return new MessageDto('La evaluacion ha sido Creado Correctamente');
    }

    //ENCONTRAR POR ID - GRUPO DE EVALUACION
    async findById(id: number): Promise<GrupoEvaluacionEntity> {
        const evaluacion = await this.grupoEvaluacionRepository.findOne({ where: { id } });
        if (!evaluacion) {
            throw new NotFoundException(new MessageDto('La evaluacion No Existe'));
        }
        return evaluacion;
    }

    //ELIMINAR GRUPO DE EVALUACION
    async delete(id: number): Promise<any> {
        const evaluacion = await this.findById(id);
        await this.grupoEvaluacionRepository.delete(id)
        return new MessageDto(`Evaluacion Eliminada`);
    }

    //ACTUALIZAR GRUPO DE EVALUACION
    async updateGestion(id: number, dto: GrupoEvaluacionDto): Promise<any> {
        const evaluacion = await this.findById(id);
        if (!evaluacion) {
            throw new NotFoundException(new MessageDto('El criterio no existe'))
        }
        dto.nombre ? evaluacion.nombre = dto.nombre : evaluacion.nombre = evaluacion.nombre;

        await this.grupoEvaluacionRepository.save(evaluacion);

        return new MessageDto(`La evaluacion ha sido Actualizada`);

    }
}
