import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { IndicadorEntity } from 'src/sic/indicador.entity';
import { IndicadorRepository } from 'src/sic/indicador.repository';

@Injectable()
export class IndicadorService {

    constructor(
        // @InjectRepository(DominioEntity)
        // private readonly dominioRepository: DominioRepository,
        @InjectRepository(IndicadorEntity)
        private readonly indicadorRepository: IndicadorRepository
    ){}

    async findById(ind_id: string): Promise<IndicadorEntity> {
        const indicador = await this.indicadorRepository.findOne({where: {ind_id}});
        if(!indicador){
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return indicador;
    }
    
    async findByDominio(id: number): Promise<IndicadorEntity[]>{
        const indicadores = await this.indicadorRepository.createQueryBuilder('indicador')
        .select(['indicador', 'ind_dominio.dom_nombre'])
        .innerJoin('indicador.ind_dominio', 'ind_dominio')
        .where('ind_dominio.dom_id = :dom', {dom: id})
        .getMany()
        if(!indicadores) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return indicadores;
    }

    async getall(): Promise<IndicadorEntity[]>{
        const ind = await this.indicadorRepository.createQueryBuilder('indicador')
        .select(['indicador', 'ind_dominio.dom_nombre'])
        .innerJoin('indicador.ind_dominio', 'ind_dominio')
        .getMany();
        if(!ind) throw new NotFoundException(new MessageDto('No hay Indicadores en la lista'))
        return ind;
    }
}
