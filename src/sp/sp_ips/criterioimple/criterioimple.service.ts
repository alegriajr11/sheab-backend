import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioImplementacionDto } from 'src/usuario/dto/SpIps/criterioimple.dto';
import { CriterioImplemRepository } from '../criterioimplement.repository';
import { CriterioImplementacionEntity } from '../criterioimplementacion.entity';
import { EvaluacionipsEntity } from '../evaluacionips.entity';
import { EvaluacionIpsRepository } from '../evaluacionips.repository';

@Injectable()
export class CriterioimpleService {

    constructor(
        @InjectRepository(CriterioImplementacionEntity)
        private criterioImplementacionRepository: CriterioImplemRepository,
        @InjectRepository(EvaluacionipsEntity)
        private evaluacionIpsRepository: EvaluacionIpsRepository,
    ){}


    async findByEva(id: number): Promise<CriterioImplementacionEntity[]> {
        const criteriosim = await this.criterioImplementacionRepository.createQueryBuilder('criterioim')
        .select(['criterioim.cri_imp_id','criterioim.cri_imp_nombre', 'criterioim.cri_imp_verificacion','cri_imp_eva.evips_nombre'])
        .innerJoin('criterioim.cri_imp_eva','cri_imp_eva')
        .where('cri_imp_eva.evips_id = :eva', {eva: id})
        .getMany()
        if(!criteriosim.length){
            throw new HttpException( new MessageDto('No hay Criterios en la lista'), HttpStatus.NOT_FOUND)
        } 
        return criteriosim;
    }

    async findByCri(cri_imp_id: number): Promise<CriterioImplementacionEntity> {
        const criterio = await this.criterioImplementacionRepository.findOne({ where: { cri_imp_id } })
        if (!criterio) {
            throw new NotFoundException(new MessageDto('El criterio No Existe'));
        }
        return criterio
    }

    // creacion de criterio con su respectiva evaluacion
    async create(evips_id: number, dto: CriterioImplementacionDto): Promise<any> {
        const evaluacion = await this.evaluacionIpsRepository.findOne({ where: { evips_id: evips_id } });
        if (!evaluacion) throw new NotFoundException(new MessageDto('La evaluacion no ha sido creada'))
        const criterio = this.criterioImplementacionRepository.create(dto)
        //asigna la evaluacion al criterio
        criterio.cri_imp_eva = evaluacion
        await this.criterioImplementacionRepository.save(criterio)
        return new MessageDto('El criterio ha sido Creada');
    }

    async update(id: number, dto: CriterioImplementacionDto): Promise<any> {

        const criterio = await this.findByCri(id);
        if (!criterio)
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));

        dto.cri_imp_nombre ? criterio.cri_imp_nombre = dto.cri_imp_nombre : criterio.cri_imp_nombre = criterio.cri_imp_nombre;
        dto.cri_imp_verificacion ? criterio.cri_imp_verificacion = dto.cri_imp_verificacion : criterio.cri_imp_verificacion = criterio.cri_imp_verificacion;

        await this.criterioImplementacionRepository.save(criterio);

        return new MessageDto(`El Criterio ha sido Actualizado`);
    }

    async delete(id: number): Promise<any> {
        const criterio = await this.findByCri(id);
        await this.criterioImplementacionRepository.delete(criterio.cri_imp_id)
        return new MessageDto(`Criterio Eliminado`);
    }
}
