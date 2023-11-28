import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SedeEntity } from './sede.entity';
import { SedeRepository } from './sede.repository';
import { PrestadorEntity } from '../prestador.entity';
import { PrestadorRepository } from '../prestador.repository';
import { SedeDto } from '../dto/sede.dto';
import { MessageDto } from 'src/common/message.dto';
import { SedeMunicipioEntity } from './sede_municipio/sede-municipio.entity';
import { SedeMunicipioRepository } from './sede_municipio/sede-municipio.repository';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class SedeService {
    constructor(
        @InjectRepository(SedeEntity)
        private readonly sedeRepository: SedeRepository,
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
        @InjectRepository(SedeMunicipioEntity)
        private readonly municipioRepository: SedeMunicipioRepository,
    ) { }


    //LISTAR TODAS LAS SEDES
    async getallSedes(): Promise<SedeEntity[]> {
        const sede = await this.sedeRepository.createQueryBuilder('sede')
            .select(['sede', 'sede_municipio.sede_mun_nombre'])
            .innerJoin('sede.sede_municipio', 'sede_municipio')
            .getMany()
        if (sede.length === 0) throw new NotFoundException(new MessageDto('No hay sedes en la lista'))
        return sede;
    }


    //ENCONTRAR POR ID - SEDE
    async findByIdSede(sede_id: number): Promise<SedeEntity> {
        const cri_pre_trans = await this.sedeRepository.findOne({ where: { sede_id } });
        if (!cri_pre_trans) {
            throw new NotFoundException(new MessageDto('La Sede No Existe'));
        }
        return cri_pre_trans;
    }

    //ENCONTRAR POR NOMBRE - SEDE
    async findByNombreSede(sede_nombre: string): Promise<SedeEntity[]> {
        const sedes = await this.sedeRepository.createQueryBuilder('sede')
            .where('sede.sede_nombre LIKE :nombre_sedes', { nombre_sedes: `%${sede_nombre}%` })
            .getMany();
        if (!sedes.length) {
            throw new NotFoundException(new MessageDto('No hay Sedes con ese nombre en la lista'))
        }
        return sedes;
    }


    //LISTAR SEDES POR ID PRESTADOR
    async findBySedePrestador(pre_cod_habilitacion: string): Promise<SedeEntity[]> {
        const sede_prestador = await this.sedeRepository.createQueryBuilder('sede')
            .select(['sede', 'sede_municipio.sede_mun_nombre'])
            .innerJoin('sede.sede_prestador', 'sede_prestador')
            .innerJoin('sede.sede_municipio', 'sede_municipio')
            .where('sede_prestador.pre_cod_habilitacion = :cod_prestador', { cod_prestador: pre_cod_habilitacion })
            // .andWhere('sede.sede_principal LIKE :principal', { principal: '%NO%' })
            .getMany()
        if(!sede_prestador.length){
            throw new NotFoundException(new MessageDto('El prestador no tiene sedes'))
        }
        return sede_prestador
    }

    //LISTAR LA SEDE PRINCIPAL
    async findBySedePrestadorNumero(pre_cod_habilitacion: string): Promise<SedeEntity> {
        const sede_prestador = await this.sedeRepository.createQueryBuilder('sede')
            .innerJoin('sede.sede_prestador', 'sede_prestador')
            .where('sede_prestador.pre_cod_habilitacion = :cod_prestador', { cod_prestador: pre_cod_habilitacion })
            .getOne()
        return sede_prestador
    }


    //CREAR SEDE
    async create(dto: SedeDto): Promise<any> {
        const { sede_numero, sede_nombre, sede_prestador, sede_municipio } = dto;
        // Verificar si la sede ya existe
        const exists = await this.sedeRepository.findOne({ where: [{ sede_nombre: sede_nombre }] });
        if (exists) {
            throw new BadRequestException(new MessageDto('Esa Sede ya existe'));
        }


        const prestador = await this.prestadorRepository.findOne({ where: { pre_cod_habilitacion: sede_prestador.pre_cod_habilitacion } });
        if (!prestador) {
            throw new InternalServerErrorException(new MessageDto('El prestador no ha sido creado'));
        }

        //CONSULTAR EL PRESTADOR AL QUE SE LE VA A ASIGNAR LA SEDE
        const sede_numero_prestador = await this.sedeRepository.createQueryBuilder('sede')
            .select(['sede'])
            .innerJoin('sede.sede_prestador', 'sede_prestador')
            .where('sede_prestador.pre_cod_habilitacion = :cod_prestador', {cod_prestador: sede_prestador.pre_cod_habilitacion})
            .getMany()
        //RECORRER LAS SEDES QUE TIENE EL PRESTADOR PARA VERIFICAR EL NUMERO DE SEDES QUE TIENE 
        sede_numero_prestador.forEach(data => {
            data.sede_numero
            if (prestador.pre_cod_habilitacion === sede_prestador.pre_cod_habilitacion && sede_numero === data.sede_numero) {
                throw new BadRequestException(new MessageDto('Ese Número de Sede ya existe'));
            }
        })


        const municipio = await this.municipioRepository.findOne({ where: { sede_mun_id: sede_municipio.sede_mun_id } });
        if (!municipio) {
            throw new BadRequestException(new MessageDto('Ese Municipio no existe'));
        }

        const sede = this.sedeRepository.create(dto)
        await this.sedeRepository.save(sede)
        return new MessageDto('La Sede ha sido Creada');
    }


    //ACTUALIZAR SEDE
    async updateSede(id: number, dto: SedeDto): Promise<any> {
        const sede = await this.findByIdSede(id);
        if (!sede) {
            throw new NotFoundException(new MessageDto('La Sede no existe'))
        }
        dto.sede_numero ? sede.sede_numero = dto.sede_numero : sede.sede_numero = sede.sede_numero;
        dto.sede_nombre ? sede.sede_nombre = dto.sede_nombre : sede.sede_nombre = sede.sede_nombre;
        dto.sede_principal ? sede.sede_principal = dto.sede_principal : sede.sede_principal = sede.sede_principal;
        dto.sede_numero_principal ? sede.sede_numero_principal = dto.sede_numero_principal : sede.sede_numero_principal = sede.sede_numero_principal;
        dto.sede_direccion ? sede.sede_direccion = dto.sede_direccion : sede.sede_direccion = sede.sede_direccion;
        dto.sede_barrio ? sede.sede_barrio = dto.sede_barrio : sede.sede_barrio = sede.sede_barrio;

        await this.sedeRepository.save(sede);

        return new MessageDto(`La sede ha sido Actualizada`);

    }

    //ELIMINAR SEDE
    async delete(id: number): Promise<any> {
        const sede = await this.findByIdSede(id);
        await this.sedeRepository.delete(sede.sede_id)
        return new MessageDto(`Sede Eliminada`);
    }

}
