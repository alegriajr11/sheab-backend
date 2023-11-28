import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioIndDto } from 'src/usuario/dto/SpInd/criterioind.dto';
import { CriterioIndEntity } from '../criterioind.entity';
import { CriterioIndRepository } from '../criterioind.repository';
import { EtapaInd } from '../etapaind.entity';
import { EtapaIndRepository } from '../etapaind.repository';
import { CalificacionIndEntity } from '../calificacionind.entity';
import { CalificacionIndRepository } from '../calificacionind.repository';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriterioindService {

    constructor(
        @InjectRepository(CriterioIndEntity)
        private criterioIndRepository: CriterioIndRepository,
        @InjectRepository(EtapaInd)
        private etapaindRepository: EtapaIndRepository,
        @InjectRepository(CalificacionIndEntity)
        private calificacionIndRepository: CalificacionIndRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,


    ) { }

    async findByEta(id: number): Promise<CriterioIndEntity[]> {
        const etapas = await this.criterioIndRepository.createQueryBuilder('criterio')
            .select(['criterio', 'eta_item.eta_nombre'])
            .innerJoin('criterio.eta_item', 'eta_item')
            .where('eta_item.eta_id = :eta', { eta: id })
            .getMany()
        if (!etapas) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return etapas;
    }

    async findCri(cri_id: number): Promise<CriterioIndEntity> {
        const criterio = await this.criterioIndRepository.findOne({ where: { cri_id } })
        if (!criterio) throw new NotFoundException(new MessageDto('No Existe el criterio'))
        return criterio
    }

    //actualiza el criterio
    async update(id: number, payloads: { dto: CriterioIndDto, tokenDto: TokenDto }): Promise<any> {
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

        const criterio = await this.findCri(id);
        if (!criterio)
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));

        dto.cri_nombre ? criterio.cri_nombre = dto.cri_nombre : criterio.cri_nombre = criterio.cri_nombre;
        dto.cri_verificacion ? criterio.cri_verificacion = dto.cri_verificacion : criterio.cri_verificacion = criterio.cri_verificacion;

        await this.criterioIndRepository.save(criterio);

        const etapa_nombre= criterio.eta_item.eta_nombre

        await this.auditoria_actualizacion_services.logUpdateCriterioSpind(
            payloadInterface.usu_nombre,
            payloadInterface.usu_apellido,
            'ip',
            dto.cri_nombre,
            etapa_nombre,
            year,
        );

        return new MessageDto(`El Criterio ha sido Actualizado`);
    }

    async delete(id: number): Promise<any> {
        const criterio = await this.findCri(id);
        await this.criterioIndRepository.delete(criterio.cri_id)
        return new MessageDto(`Criterio Eliminado`);
    }

    //creacion de criterio con su respectivo item
    async create(item_id: number, payloads: { dto: CriterioIndDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const { cri_nombre } = dto;

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

            const exists = await this.criterioIndRepository.findOne({ where: [{ cri_nombre: cri_nombre }] });
            if (exists) throw new BadRequestException(new MessageDto('Ese Criterio ya existe'));
            const etapa = await this.etapaindRepository.findOne({ where: { eta_id: item_id } });
            if (!etapa) throw new InternalServerErrorException(new MessageDto('La actividad no ha sido creada'))
            const criterio = this.criterioIndRepository.create(dto)
            criterio.eta_item = etapa
            await this.criterioIndRepository.save(criterio)

            //asignamos la etapa
            const etapa_nombre = etapa.eta_nombre;

            // ASIGNAR LA AUDITORIA DE LA CALIFICACION ASIGNADO AL CRITERIO
            await this.auditoria_registro_services.logCreateCriterioSpind(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                dto.cri_nombre,
                etapa_nombre,
                year,
            );
            return new MessageDto('El criterio ha sido Creado');
        } catch (error) {

        }
    }

    //LISTAR TODOS LOS CRITERIOS.
    async getallcriterio(): Promise<CriterioIndEntity[]> {
        const criterio_ind = await this.criterioIndRepository.createQueryBuilder('criterio')
            .select(['criterio', 'calificaciones_cri.cal_asignado', 'calificaciones_cri.cal_nota', 'calificaciones_cri.cal_observaciones', 'eta_item.eta_nombre', 'cal_evaluacion_independientes.cal_id'])
            .innerJoinAndSelect('criterio.calificaciones_cri', 'calificaciones_cri')
            .innerJoinAndSelect('criterio.eta_item', 'eta_item')
            .innerJoinAndSelect('calificaciones_cri.cal_evaluacion_independientes', 'cal_evaluacion_independientes')
            .getMany()
        if (!criterio_ind.length) throw new NotFoundException(new MessageDto('No hay una evaluacion asignada en la lista'))
        return criterio_ind
    }








}