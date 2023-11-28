/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ClaseEntity } from './clase.entity';
import { ClaseRepository } from './clase.repository';

@Injectable()
export class ClaseService {
    constructor(
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: ClaseRepository
    ){}

    async getall(): Promise<ClaseEntity[]>{
        const clase = await this.claseRepository.find()
        if(!clase.length) throw new NotFoundException(new MessageDto('No hay clase'))
        return clase
    }
}
