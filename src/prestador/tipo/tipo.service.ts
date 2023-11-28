/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { TipoEntity } from './tipo.entity';
import { TipoRepository } from './tipo.repository';

@Injectable()
export class TipoService {
    
    constructor(
        @InjectRepository(TipoEntity)
        private readonly tipoRepository: TipoRepository
    ){}

    async getall(): Promise<TipoEntity[]>{
        const tipo = await this.tipoRepository.find()
        if(!tipo.length) throw new NotFoundException(new MessageDto('No hay Tipos'))
        return tipo
    }
}
