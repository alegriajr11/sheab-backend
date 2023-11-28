/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { MunicipioEntity } from './municipio.entity';
import { MunicipioRepository } from './municipio.repository';

@Injectable()
export class MunicipioService {

    constructor(
        @InjectRepository(MunicipioEntity)
        private readonly municipioRepository: MunicipioRepository
    ){}

    async findById(mun_id: number): Promise<MunicipioEntity> {
        const municipio = await this.municipioRepository.findOne({where: {mun_id}});
        if(!municipio){
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return municipio;
    }

    async getall(): Promise<MunicipioEntity[]> {
        const municipios = await this.municipioRepository.find();
        if(!municipios.length) throw new NotFoundException(new MessageDto('No hay municipios en la lista'))
        return municipios;
    }

}
