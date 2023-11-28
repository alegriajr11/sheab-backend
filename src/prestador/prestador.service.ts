/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { MunicipioEntity } from 'src/municipio/municipio.entity';
import { MunicipioRepository } from 'src/municipio/municipio.repository';
import { ClaseEntity } from './clase/clase.entity';
import { ClaseRepository } from './clase/clase.repository';
import { ClasificacionEntity } from './clasificacion/clasificacion.entity';
import { ClasificacionRepository } from './clasificacion/clasificacion.repository';
import { CreatePrestadorDto } from './dto/create-prestador.dto';
import { PrestadorEntity } from './prestador.entity';
import { PrestadorRepository } from './prestador.repository';
import { TipoEntity } from './tipo/tipo.entity';
import { TipoRepository } from './tipo/tipo.repository';
import { PrestadorDto } from './dto/prestador.dto';

@Injectable()
export class PrestadorService {
    constructor(
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
        @InjectRepository(MunicipioEntity)
        private readonly municipioRepository: MunicipioRepository,
        @InjectRepository(ClasificacionEntity)
        private readonly clasificacionRepository: ClasificacionRepository,
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: ClaseRepository,
        @InjectRepository(TipoEntity)
        private readonly tipoRepository: TipoRepository
    ) { }

    async findById(pre_cod_habilitacion: string): Promise<PrestadorEntity> {

        const prestador = await this.prestadorRepository.createQueryBuilder('prestador')
        .select(['prestador', 'pre_clasificacion.cla_nombre'])
        .innerJoin('prestador.pre_clasificacion', 'pre_clasificacion')
        .where('prestador.pre_cod_habilitacion = :cod_habilitacion', {cod_habilitacion: pre_cod_habilitacion})
        .getOne()        
        // const prestador = await this.prestadorRepository.findOne({ where: { pre_cod_habilitacion } });
        if (!prestador) {
            throw new NotFoundException(new MessageDto('No Existe el Prestador'));
        }
        return prestador;
    }

    async findByNombre(nombre: string): Promise<PrestadorEntity> {
        const prestador = await this.prestadorRepository.findOne({
            where: { pre_nombre: nombre },
        });
        return prestador;
    }

    //LISTAR PRESTADORES POR MUNICIPIO
    async findByMunicipio(id: string): Promise<PrestadorEntity[]> {
        const prestadores = await this.prestadorRepository.createQueryBuilder('prestador')
            .innerJoin('prestador.pre_municipio', 'pre_municipio')
            .where('pre_municipio.mun_id = :mun', { mun: id })
            .andWhere('prestador.pre_habilitado LIKE :habilitado', { habilitado: '%SI%' })
            .getMany()
        return prestadores;
    }

    //LISTAR PRESTADORES PARA PAMEC
    async findByMunicipioPamec(id: string): Promise<PrestadorEntity[]> {
        const prestadores = await this.prestadorRepository.createQueryBuilder('prestador')
            .leftJoinAndSelect('prestador.pre_municipio', 'pre_municipio')
            .leftJoinAndSelect('prestador.pre_clasificacion', 'pre_clasificacion')
            .where('pre_municipio.mun_id = :mun', { mun: id })
            .andWhere('pre_clasificacion.cla_id IN (:clasificacion)', { clasificacion: ['1', '2'] })
            .andWhere('prestador.pre_habilitado LIKE :habilitado', { habilitado: '%SI%' })
            .getMany()
        return prestadores;
    }

    //LISTAR PRESTADORES PARA SP-INDEPENDIENTES
    async findByMunicipioIndependientes(id: string): Promise<PrestadorEntity[]> {
        const prestadores = await this.prestadorRepository.createQueryBuilder('prestador')
            .leftJoinAndSelect('prestador.pre_municipio', 'pre_municipio')
            .leftJoinAndSelect('prestador.pre_clasificacion', 'pre_clasificacion')
            .where('pre_municipio.mun_id = :mun', { mun: id })
            .andWhere('pre_clasificacion.cla_id IN (:clasificacion)', { clasificacion: ['3'] })
            .andWhere('prestador.pre_habilitado LIKE :habilitado', { habilitado: '%SI%' })
            .getMany()
        return prestadores;
    }

    //LISTAR PRESTADORES PARA SP-IPS
    async findByMunicipioIps(id: string): Promise<PrestadorEntity[]> {
        const prestadores = await this.prestadorRepository.createQueryBuilder('prestador')
            .leftJoinAndSelect('prestador.pre_municipio', 'pre_municipio')
            .leftJoinAndSelect('prestador.pre_clasificacion', 'pre_clasificacion')
            .where('pre_municipio.mun_id = :mun', { mun: id })
            .andWhere('pre_clasificacion.cla_id IN (:clasificacion)', { clasificacion: ['1'] })
            .andWhere('prestador.pre_habilitado LIKE :habilitado', { habilitado: '%SI%' })
            .getMany()
        return prestadores;
    }


    async getall(): Promise<PrestadorEntity[]> {
        const prestadores = await this.prestadorRepository.createQueryBuilder('prestador')
            .select(['prestador', 'pre_municipio.mun_nombre', 'pre_clasificacion.cla_id'])
            .innerJoin('prestador.pre_municipio', 'pre_municipio')
            .innerJoinAndSelect('prestador.pre_clasificacion', 'pre_clasificacion')
            .getMany()
        if (!prestadores.length) throw new NotFoundException(new MessageDto('No hay Prestadores en la lista'))
        return prestadores;
    }


    /*CREANDO PRESTADOR*/
    async create(dto: CreatePrestadorDto): Promise<any> {
        const { pre_cod_habilitacion, pre_nombre, pre_clasificacion, pre_clase, pre_tipo, pre_municipio, pre_representante } = dto;
        const exists = await this.prestadorRepository.findOne({ where: [{ pre_cod_habilitacion: pre_cod_habilitacion }, { pre_nombre: pre_nombre }] });
        if (exists) throw new BadRequestException(new MessageDto('Ese Prestador ya existe'));


        const clasificacion = await this.clasificacionRepository.findOne({ where: { cla_id: pre_clasificacion.cla_id } })
        if (!clasificacion) throw new BadRequestException(new MessageDto('Esa Clasificación no existe'));

        const clase = await this.claseRepository.findOne({ where: { clas_id: pre_clase.clas_id } })
        if (!clase) throw new BadRequestException(new MessageDto('Esa Clase no existe'));

        const tipo = await this.tipoRepository.findOne({ where: { tip_id: pre_tipo.tip_id } })
        if (!tipo) throw new BadRequestException(new MessageDto('Ese Tipo no existe'));

        const municipio = await this.municipioRepository.findOne({ where: { mun_id: pre_municipio.mun_id } })
        if (!municipio) throw new BadRequestException(new MessageDto('Ese Municipio no existe'));

        
        if (pre_representante) dto.pre_representante = pre_representante; 

        const prestador = this.prestadorRepository.create(dto);

        await this.prestadorRepository.save(prestador)
        return new MessageDto('Prestador Creado Exitosamente');

    }



    /*ACTUALIZANDO PRESTADOR*/
    async update(id: string, dto: PrestadorDto): Promise<any> {
        const prestador = await this.findById(id);
        if (!prestador)
            throw new NotFoundException(new MessageDto('El Prestador No Existe'));

        dto.pre_cod_habilitacion ? prestador.pre_cod_habilitacion = dto.pre_cod_habilitacion : prestador.pre_cod_habilitacion = prestador.pre_cod_habilitacion;

        dto.pre_nombre ? prestador.pre_nombre = dto.pre_nombre : prestador.pre_nombre = prestador.pre_nombre;

        dto.pre_nit ? prestador.pre_nit = dto.pre_nit : prestador.pre_nit = prestador.pre_nit;

        dto.pre_direccion ? prestador.pre_direccion = dto.pre_direccion : prestador.pre_direccion = prestador.pre_direccion;

        dto.pre_telefono ? prestador.pre_telefono = dto.pre_telefono : prestador.pre_telefono = prestador.pre_telefono;

        dto.pre_email ? prestador.pre_email = dto.pre_email : prestador.pre_email = prestador.pre_email;

        dto.pre_habilitado ? prestador.pre_habilitado = dto.pre_habilitado : prestador.pre_habilitado = prestador.pre_habilitado;

        prestador.pre_representante = dto.pre_representante !== undefined ? dto.pre_representante : "";

        await this.prestadorRepository.save(prestador);

        return new MessageDto(`Prestador ${prestador.pre_nombre} Actualizado`);
    }


    async delete(id: string): Promise<any> {
        const prestador = await this.findById(id);
        await this.prestadorRepository.delete(prestador.pre_cod_habilitacion)
        return new MessageDto(`Prestador ${prestador.pre_nombre} eliminado`);
    }
}
