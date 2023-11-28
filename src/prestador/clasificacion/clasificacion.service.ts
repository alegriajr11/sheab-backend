/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ClasificacionEntity } from './clasificacion.entity';
import { ClasificacionRepository } from './clasificacion.repository';

@Injectable()
export class ClasificacionService {
    constructor(
        @InjectRepository(ClasificacionEntity)
        private readonly clasificacionRepository: ClasificacionRepository
    ) { }

    async getall(): Promise<ClasificacionEntity[]> {
        const clasificacion = await this.clasificacionRepository.find()
        if (!clasificacion.length) throw new NotFoundException(new MessageDto('No hay Clasificacion'))
        return clasificacion
    }

    //LISTAR CLASIFICACION POR ID
    async findById(cla_id: number): Promise<ClasificacionEntity> {
        const clasificacion = await this.clasificacionRepository.findOne({ where: { cla_id } });
        if (!clasificacion) {
            throw new NotFoundException(new MessageDto('No Existe Clasificacion'));
        }
        return clasificacion;
    }
}
