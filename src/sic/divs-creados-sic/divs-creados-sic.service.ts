import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DivCreadoSicEntity } from './div-creado-sic.entity';
import { DivCreadoSicRepository } from './div-creado-sic.repository';
import { DivCreadoSicDto } from 'src/usuario/dto/Sic/divCreados.dto';
import { EvaluacionSicEntity } from '../evaluacionsic.entity';
import { EvaluacionsicRepository } from '../evaluacionsic.repository';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class DivsCreadosSicService {

    constructor(
        @InjectRepository(DivCreadoSicEntity)
        private readonly div_creadoSicRepository: DivCreadoSicRepository,
        @InjectRepository(EvaluacionSicEntity)
        private readonly evaluacionSicRepository: EvaluacionsicRepository,
    ) { }

    //CREAR DIV - SIC
    async createDiv(payloads: { dto: DivCreadoSicDto }): Promise<any> {
        try {
            const { dto } = payloads;

            // SE BUSCA LA EVALUACION QUE SE ASIGNA AL CUMPLIMIENTO
            const evaluacion_sic = await this.evaluacionSicRepository.findOne({ where: { eva_id: dto.div_creado_eva.eva_id }, relations: ['eval_acta_sic'] });
            if (!evaluacion_sic) {
                throw new Error('La evaluación no ha sido creada');
            }

            const divs = await this.div_creadoSicRepository.createQueryBuilder('divs')
            .select('divs')
            .innerJoinAndSelect('divs.div_creado_eva', 'div_creado_eva')
            .where('div_creado_eva.eva_id = :id_eva', {id_eva: dto.div_creado_eva.eva_id})
            .andWhere('divs.div_id_dominio = :id_dominio', {id_dominio: dto.div_id_dominio})
            .andWhere('divs.div_id_indicador = :id_indicador', {id_indicador: dto.div_id_indicador})
            .getOne()
            
            if(divs){
                throw new Error('El dominio e indicador seleccionado ya fueron agregados a la evaluación');
            }

            // CREAMOS EL DTO DEL DIV
            const div_sic = await this.div_creadoSicRepository.create(dto);

            // ASIGNAMOS LA FORANEA DE CUMPLIMIENTO CON EVALUACIÓN_SIC CREADA
            div_sic.div_creado_eva = evaluacion_sic;

            // GUARDAMOS EL DIV A LA BASE DE DATOS
            await this.div_creadoSicRepository.save(div_sic);


            return new MessageDto('Indicador Asignado');
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(new MessageDto(error.message));
        }
    }

}
