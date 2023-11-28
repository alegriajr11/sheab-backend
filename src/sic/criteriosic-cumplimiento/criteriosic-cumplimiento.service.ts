import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CreatePrestadorDto } from 'src/prestador/dto/create-prestador.dto';
import { DominioPrestadorDto } from 'src/prestador/dto/dominioPrestador.dto';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { PrestadorRepository } from 'src/prestador/prestador.repository';
import { CumplimientoEstandarSicDto } from 'src/usuario/dto/Sic/cumplimientoEstandar.dto';
import { CumplimientoSicDto } from 'src/usuario/dto/Sic/cumplimientosic.dto';
import { In } from 'typeorm';
import { CriterioEstandarSicEntity } from '../criteriosEstandar.entity';
import { CriterioEstandarSicRepository } from '../criteriosEstandar.repository';
import { CriteriosicEntity } from '../criteriosic.entity';
import { CriterioSicRepository } from '../criteriosic.repository';
import { CumplimientoEstandarSicEntity } from '../cumplimientoestandar.entity';
import { CumplimientoEstandarSicRepository } from '../cumplimientoEstandar.repository';
import { CumplimientoSicEntity } from '../cumplimientosic.entity';
import { CumplimientoSicRepository } from '../cumplimientosic.repository';
import { DominioEntity } from '../dominio.entity';
import { DominioRepository } from '../dominio.repository';
import { IndicadorEntity } from '../indicador.entity';
import { IndicadorRepository } from '../indicador.repository';
import { EvaluacionSicEntity } from '../evaluacionsic.entity';
import { EvaluacionsicRepository } from '../evaluacionsic.repository';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';


@Injectable()
export class CriteriosicCumplimientoService {

    constructor(
        @InjectRepository(CriterioEstandarSicEntity)
        private readonly criterioEstandarSicRepository: CriterioEstandarSicRepository,
        @InjectRepository(CumplimientoEstandarSicEntity)
        private readonly cumplimientoEstandarSicRepository: CumplimientoEstandarSicRepository,
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
        @InjectRepository(DominioEntity)
        private readonly dominioRepository: DominioRepository,
        @InjectRepository(IndicadorEntity)
        private readonly indicadorRepository: IndicadorRepository,
        @InjectRepository(EvaluacionSicEntity)
        private readonly evaluacionSicRepository: EvaluacionsicRepository,
        @InjectRepository(CriteriosicEntity)
        private readonly criterioSicRepository: CriterioSicRepository,
        @InjectRepository(CumplimientoSicEntity)
        private readonly cumplimientoSicRepository: CumplimientoSicRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,

    ) { }


    //ENCONTRAR CRITERIO ESTANDAR POR ID
    async findByIdEstandarSic(crie_id: number): Promise<CriterioEstandarSicEntity> {
        const criterioEstandarsic = await this.criterioEstandarSicRepository.findOne({ where: { crie_id } });
        if (!criterioEstandarsic) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterioEstandarsic;
    }

    //ENCONTRAR CRITERIO ESTANDAR POR ID
    async findByIdCumliSic(ind_id: string): Promise<IndicadorEntity> {
        const criterioEstandarsic = await this.indicadorRepository.findOne({ where: { ind_id } });
        if (!criterioEstandarsic) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterioEstandarsic;
    }

    /*LISTANDO CUMPLIMIENTO POR ID CRITERIO Y EVA_ID */
    async getCumplimientoId(crie_id: number, eva_id: number): Promise<CumplimientoEstandarSicEntity[]> {
        const cumplimiento_estandar = await this.cumplimientoEstandarSicRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterioestandar_sic'])
            .innerJoin('cumplimiento.criterioestandar_sic', 'criterioestandar_sic')
            .innerJoinAndSelect('cumplimiento.cumplimiento_eva_sic', 'cumplimiento_eva_sic')
            .where('criterioestandar_sic.crie_id = :id_criterio', {id_criterio: crie_id})
            .andWhere('cumplimiento_eva_sic.eva_id = :id_evaluacion', {id_evaluacion: eva_id})
            .getMany()
        if (!cumplimiento_estandar.length) throw new NotFoundException(new MessageDto('No existen cumplimientos en la lista'))
        
        return cumplimiento_estandar
    }

    //LISTANDO TODOS LOS CUMPLIMIENTOS ASIGNADOS
    async getUltimoCumplimiento(): Promise<CumplimientoEstandarSicEntity> {
        const cumplimiento_estandar = await this.cumplimientoEstandarSicRepository.createQueryBuilder('cumplimiento')
        .select(['cumplimiento'])
        .orderBy('cumplimiento.cumpl_id', 'DESC')
        .getOne();

        if (!cumplimiento_estandar) throw new NotFoundException(new MessageDto('No existe cumplimiento en la lista'))
        return cumplimiento_estandar
    }

    //CREAR CUMPLIMIENTO ESTANDAR SIC
    async createCumplimientoEstandar(payloads: { dto: CumplimientoEstandarSicDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;

            const usuario = await this.jwtService.decode(tokenDto.token);

            const payloadInterface: PayloadInterface = {
                usu_id: usuario[`usu_id`],
                usu_nombre: usuario[`usu_nombre`],
                usu_apellido: usuario[`usu_apellido`],
                usu_nombreUsuario: usuario[`usu_nombreUsuario`],
                usu_email: usuario[`usu_email`],
                usu_estado: usuario[`usu_estado`],
                usu_roles: usuario[`usu_roles`]
            };

            const year = new Date().getFullYear().toString();

            // SE BUSCA EL CRITERIO QUE SE ASIGNA AL CUMPLIMIENTO
            const criterio_estandarsic = await this.criterioEstandarSicRepository.findOne({ where: { crie_id: dto.crie_id } });
            if (!criterio_estandarsic) {
                throw new Error('El criterio no ha sido creado');
            }

            const nombre_criterio = criterio_estandarsic.crie_nombre;

            // SE BUSCA LA EVALUACION QUE SE ASIGNA AL CUMPLIMIENTO
            const evaluacion_sic = await this.evaluacionSicRepository.findOne({ where: { eva_id: dto.eva_id }, relations: ['eval_acta_sic'] });
            if (!evaluacion_sic) {
                throw new Error('La evaluación no ha sido creada');
            }

            //ASIGNO EL ACTA ID
            const acta_idSic = evaluacion_sic.eval_acta_sic.act_id;

            // ASIGNO EL CUMPLIMIENTO EN ASIGNADO
            dto.cumpl_asignado = 'asignado';
            

            // CREAMOS EL DTO DEL CUMPLIMIENTO
            const cumplimiento = await this.cumplimientoEstandarSicRepository.create(dto);

            // ASIGNAMOS LA FORANEA DE CUMPLIMIENTO CON CRITERIO_ESTANDAR
            cumplimiento.criterioestandar_sic = criterio_estandarsic;
            // ASIGNAMOS LA FORANEA DE CUMPLIMIENTO CON EVALUACIÓN_SIC CREADA
            cumplimiento.cumplimiento_eva_sic = evaluacion_sic;

            // GUARDAMOS EL CUMPLIMIENTO A LA BASE DE DATOS
            await this.cumplimientoEstandarSicRepository.save(cumplimiento);

            // ASIGNAR LA AUDITORIA DEL CUMPLIMIENTO ASIGNADO AL CRITERIO
            await this.auditoria_registro_services.logCreateCumplimientoSic(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                dto.cumpl_cumple,
                nombre_criterio,
                acta_idSic,
                year,
            );
            
            return new MessageDto('Cumplimiento Asignado');
        } catch (error) {
            // Manejo de un error.
            throw new InternalServerErrorException(new MessageDto(error.message));
        }
    }


    //ENCONTRAR CUMPLIMIENTO ESTANDAR POR CRI_ID CUMPLIDO
    // async findByIdCumpl(crie_id: number): Promise<CumplimientoEstandarSicEntity> {
    //     const criterio_estandarsic = await this.criterioEstandarSicRepository.findOne({ where: { crie_id: crie_id } });
    //     const cumplimientoEstandar = await this.cumplimientoEstandarSicRepository.findOne({ where: { criterioestandar_sic: criterio_estandarsic } });
    //     if (!cumplimientoEstandar) {
    //         throw new NotFoundException(new MessageDto('El Cumplimiento No Existe'));
    //     }
    //     return cumplimientoEstandar;
    // }
}
