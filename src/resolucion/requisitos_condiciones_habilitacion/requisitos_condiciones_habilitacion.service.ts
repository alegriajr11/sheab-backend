import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConceptoResEntity } from './concepto_res.entity';
import { ConceptoResRepository } from './concepto_res.repository';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class RequisitosCondicionesHabilitacionService {

    constructor(
        @InjectRepository(ConceptoResEntity)
        private readonly concepto3100Repository: ConceptoResRepository
    ) { }


    //LISTAR TODAS LAS CONDICIONES
    async getAllCondiciones(): Promise<ConceptoResEntity[]> {
        const condiciones = await this.concepto3100Repository.createQueryBuilder('condiciones')
            .select(['condiciones'])
            .getMany();

        if(!condiciones){
            throw new NotFoundException(new MessageDto('No hay Condiciones de Habilitación'));
        }
        
        return condiciones;

    }
}
