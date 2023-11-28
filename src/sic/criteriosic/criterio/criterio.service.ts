import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriteriosicEntity } from 'src/sic/criteriosic.entity';
import { CriterioSicRepository } from 'src/sic/criteriosic.repository';

@Injectable()
export class CriterioService {

    constructor(
        @InjectRepository(CriteriosicEntity)
        private readonly criteriosicRepository: CriterioSicRepository
    ){}

    async getall(): Promise<CriteriosicEntity[]> {
        const criterios = await this.criteriosicRepository.find();
        if(!criterios.length) throw new NotFoundException(new MessageDto('No hay criterios en la lista'))
        return criterios;
    }

    async findByIndicador(id: string): Promise<CriteriosicEntity[]>{
        const criterios = await this.criteriosicRepository.createQueryBuilder('criterio')
        .select(['criterio', 'indicadores.ind_id', 'indicadores.ind_nombre'])
        .innerJoin('criterio.indicadores', 'indicadores')
        .where('indicadores.ind_id = :ind', {ind: id})
        .orderBy('criterio.cri_id')
        .getMany()
        if(!criterios) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return criterios;
    }


}
