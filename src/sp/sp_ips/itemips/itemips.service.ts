import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ItemEntity } from '../item.entity';
import { ItemIpsRepository } from '../item.repository';

@Injectable()
export class ItemipsService {

    constructor(
        @InjectRepository(ItemEntity)
        private readonly itemipsRepository: ItemIpsRepository
    ){}

    async findById(ite_id: number): Promise<ItemEntity> {
        const item = await this.itemipsRepository.findOne({where: {ite_id}});
        if(!item){
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return item;
    }

    async getall(): Promise<ItemEntity[]> {
        const items = await this.itemipsRepository.find();
        if(!items.length) throw new NotFoundException(new MessageDto('No hay Items en la lista'))
        return items;
    }
}
