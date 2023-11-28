import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioEstandarDto } from 'src/usuario/dto/Sic/criterioEstandar.dto';
import { CriterioSicDto } from 'src/usuario/dto/Sic/criteriosic.dto';
import { Like } from 'typeorm';
import { CriterioEstandarSicEntity } from '../criteriosEstandar.entity';
import { CriterioEstandarSicRepository } from '../criteriosEstandar.repository';
import { CriteriosicEntity } from '../criteriosic.entity';
import { CriterioSicRepository } from '../criteriosic.repository';
import { DominioEntity } from '../dominio.entity';
import { DominioRepository } from '../dominio.repository';
import { IndicadorEntity } from '../indicador.entity';
import { IndicadorRepository } from '../indicador.repository';

@Injectable()
export class CriteriosicService {


    constructor(
        @InjectRepository(DominioEntity)
        private readonly dominioRepository: DominioRepository,
        @InjectRepository(IndicadorEntity)
        private readonly indicadorRepository: IndicadorRepository,
        @InjectRepository(CriteriosicEntity)
        private readonly criterioSicRepository: CriterioSicRepository,
        @InjectRepository(CriterioEstandarSicEntity)
        private readonly criterioEstandarSicRepository: CriterioEstandarSicRepository,

    ) { }


    async getall(): Promise<DominioEntity[]> {
        const dom = await this.dominioRepository.find()
        if (!dom) throw new NotFoundException(new MessageDto('No hay Criterios en la lista'))
        return dom;
    }



    //OBTENER TODOS LOS CRITERIOS ESTANDAR
    async criterioEstandarAll(): Promise<CriterioEstandarSicEntity[]> {
        const estandar = await this.criterioEstandarSicRepository.find()
        if (!estandar) throw new NotFoundException(new MessageDto('No hay Criterios Estandar en la lista'))
        return estandar;
    }

    //ENCONTRAR POR ID - CRITERIO ESTANDAR SIC
    async findByIdEstandarSic(crie_id: number): Promise<CriterioEstandarSicEntity> {
        const criterioEstandarsic = await this.criterioEstandarSicRepository.findOne({ where: { crie_id } });
        if (!criterioEstandarsic) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterioEstandarsic;
    }

    //ELIMINAR CRITERIO ESTANDAR SIC
    async deleteEstandar(id: number): Promise<any> {
        const criterioEstsic = await this.findByIdEstandarSic(id);
        await this.criterioEstandarSicRepository.delete(criterioEstsic.crie_id)
        return new MessageDto(`Criterio Eliminado`);
    }


    //CREAR CRITERIO ESTANDAR
    async crearCriterioEstandar(dto: CriterioEstandarDto): Promise<any> {
        const { crie_nombre } = dto
        const exists = await this.criterioEstandarSicRepository.findOne({ where: [{ crie_nombre: crie_nombre }] });
        if (exists) throw new BadRequestException(new MessageDto('Ese Criterio ya existe'));
        const criterio = this.criterioEstandarSicRepository.create(dto)
        await this.criterioEstandarSicRepository.save(criterio)
        return new MessageDto('El Criterio ha sido creado')
    }



    //ENCONTRAR POR ID - CRITERIO SIC
    async findByIdSic(cri_id: number): Promise<CriteriosicEntity> {
        const criteriosic = await this.criterioSicRepository.findOne({ where: { cri_id } });
        if (!criteriosic) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criteriosic;
    }

    //OBTENER TOODOS LOS CRITERIOS SIC
    async getallCriterioSic(): Promise<CriteriosicEntity[]> {
        const criteriosic = await this.criterioSicRepository.find()
        if (!criteriosic) throw new NotFoundException(new MessageDto('No hay Criterios en la lista'))
        return criteriosic;
    }


    //ELIMINAR CRITERIO SIC
    async delete(id: number): Promise<any> {
        const criteriosic = await this.findByIdSic(id);
        await this.criterioSicRepository.delete(criteriosic.cri_id)
        return new MessageDto(`Criterio Eliminado`);
    }

    //CREAR CRITERIOS SIC
    async crearCriterioSic(dto: CriterioSicDto): Promise<any> {
        const { cri_nombre } = dto
        const exists = await this.criterioSicRepository.findOne({ where: [{ cri_nombre: cri_nombre }] });
        if (exists) throw new BadRequestException(new MessageDto('Ese Criterio ya existe'));
        const criterio = this.criterioSicRepository.create(dto)
        await this.criterioSicRepository.save(criterio)
        return new MessageDto('El Criterio ha sido creado')
    }

    //ACTUALIZAR CRITERIO SIC
    async updatesic(id: number, dto: CriterioSicDto): Promise<any> {
        const criteriosic = await this.findByIdSic(id);
        if (!criteriosic) {
            throw new NotFoundException(new MessageDto('El criterio no existe'))
        }
        dto.cri_nombre ? criteriosic.cri_nombre = dto.cri_nombre : criteriosic.cri_nombre = criteriosic.cri_nombre;

        await this.criterioSicRepository.save(criteriosic);

        return new MessageDto(`El criterio ha sido Actualizado`);

    }
}
