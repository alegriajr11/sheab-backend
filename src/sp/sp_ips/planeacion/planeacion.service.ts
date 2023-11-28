import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioPlaneacionDto } from 'src/usuario/dto/SpIps/criterioplaneacion.dto';
import { CriterioPlaneacionRepository } from '../criterioplaneac.repository';
import { CriterioPlaneacionEntity } from '../criterioplaneacion.entity';
import { EvaluacionipsEntity } from '../evaluacionips.entity';
import { EvaluacionIpsRepository } from '../evaluacionips.repository';

@Injectable()
export class PlaneacionService {

    constructor(
        @InjectRepository(CriterioPlaneacionEntity)
        private criterioPlaneacionRepository: CriterioPlaneacionRepository,
        @InjectRepository(EvaluacionipsEntity)
        private evaluacionIpsRepository: EvaluacionIpsRepository,
    ){}



    async findByEva(id: number): Promise<CriterioPlaneacionEntity[]> {
        const criteriosp = await this.criterioPlaneacionRepository.createQueryBuilder('criteriop')
        .select(['criteriop.cri_pla_id','criteriop.cri_pla_nombre', 'criteriop.cri_pla_verificacion','cri_pla_eva.evips_nombre'])
        .innerJoin('criteriop.cri_pla_eva','cri_pla_eva')
        .where('cri_pla_eva.evips_id = :eva', {eva: id})
        .getMany()
        if(!criteriosp.length) throw new NotFoundException(new MessageDto('No hay Criterios en la lista'))
        return criteriosp;
    }

    async findByCri(cri_pla_id: number): Promise<CriterioPlaneacionEntity> {
        const criterio = await this.criterioPlaneacionRepository.findOne({ where: { cri_pla_id } })
        if (!criterio) {
            throw new NotFoundException(new MessageDto('El criterio No Existe'));
        }
        return criterio
    }

     // creacion de criterio con su respectiva evaluacion
     async create(evips_id: number, dto: CriterioPlaneacionDto): Promise<any> {
        const evaluacion = await this.evaluacionIpsRepository.findOne({ where: { evips_id: evips_id } });
        if (!evaluacion) throw new NotFoundException(new MessageDto('La evaluacion no ha sido creada'))
        const criterio = this.criterioPlaneacionRepository.create(dto)
        //asigna la evaluacion al criterio
        criterio.cri_pla_eva = evaluacion
        await this.criterioPlaneacionRepository.save(criterio)
        return new MessageDto('El criterio ha sido Creada');
    }

    async update(id: number, dto: CriterioPlaneacionDto): Promise<any> {

        const criterio = await this.findByCri(id);
        if (!criterio)
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));

        dto.cri_pla_nombre ? criterio.cri_pla_nombre = dto.cri_pla_nombre : criterio.cri_pla_nombre = criterio.cri_pla_nombre;
        dto.cri_pla_verificacion ? criterio.cri_pla_verificacion = dto.cri_pla_verificacion : criterio.cri_pla_verificacion = criterio.cri_pla_verificacion;

        await this.criterioPlaneacionRepository.save(criterio);

        return new MessageDto(`El Criterio ha sido Actualizado`);
    }

    async delete(id: number): Promise<any> {
        const criterio = await this.findByCri(id);
        await this.criterioPlaneacionRepository.delete(criterio.cri_pla_id)
        return new MessageDto(`Criterio Eliminado`);
    }
}
