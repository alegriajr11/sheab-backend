import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ActividadEntity } from '../actividad.entity';
import { ActividadRepository } from '../actividad.repository';

@Injectable()
export class ActividadService {

    constructor(
        @InjectRepository(ActividadEntity)
        private readonly actividadRepository: ActividadRepository
    ){}

    async getall(): Promise<ActividadEntity[]>{
        const act = await this.actividadRepository.find()
        if(!act) throw new NotFoundException(new MessageDto('No hay Indicadores en la lista'))
        return act;
    }

    async findById(act_id: number): Promise<ActividadEntity> {
        const actividad = await this.actividadRepository.findOne({where: {act_id}});
        if(!actividad){
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return actividad;
    }
}
