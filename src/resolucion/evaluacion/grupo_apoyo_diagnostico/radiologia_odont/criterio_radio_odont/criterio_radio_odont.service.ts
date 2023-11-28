import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioRadiologiaOdontoEntity } from '../criterio_radio_odont.entity';
import { RadiologiaOdontoEntity } from '../radiologia_odont.entity';
import { CriterioRadiologiaOdontoRepository } from '../criterio_radio_odont.repository';
import { RadiologiaOdontoRepository } from '../radiologia_odont.repository';
import { CriterioRadiologiaOdontoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/radiologia_odont_dto/criterio_radio_odont.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriterioRadioOdontService {

    constructor(
        @InjectRepository(CriterioRadiologiaOdontoEntity)
        private readonly criterioRadiologiaOdontoRepository: CriterioRadiologiaOdontoRepository,
        @InjectRepository(RadiologiaOdontoEntity)
        private readonly radiologiaOdontoRepository: RadiologiaOdontoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioRadiologiaOdontoEntity[]> {
        const cri_rad_odon = await this.criterioRadiologiaOdontoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'rad_odontologica.rad_odont_nombre_estandar'])
            .innerJoin('criterio.rad_odontologica', 'rad_odontologica')
            .where('rad_odontologica.rad_odont_id = :odon_est', { odon_est: id })
            .getMany()
        if (!cri_rad_odon) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_rad_odon
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioRadiologiaOdontoEntity[]> {
        const criterio = await this.criterioRadiologiaOdontoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO RADIOLOGIA ODOCTOLOGICA
    async create(rad_odont_id: number, payloads: { dto: CriterioRadiologiaOdontoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const radioodonto = await this.radiologiaOdontoRepository.findOne({ where: { rad_odont_id: rad_odont_id } });
            if (!radioodonto) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioradioodonto = this.criterioRadiologiaOdontoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioradioodonto.rad_odontologica = radioodonto

            //GUARDAR LOS DATOS EN LA BD
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

            await this.criterioRadiologiaOdontoRepository.save(criterioradioodonto)
            await this.auditoria_registro_services.logCreateRadioOdondologica(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                year
            );

            return new MessageDto('El criterio ha sido Creado Correctamente');
        } catch (error) {
            // Aquí puedes manejar el error como desees, por ejemplo, registrarlo o lanzar una excepción personalizada.
            throw error;
        }
    }

    //ENCONTRAR POR ID - CRITERIO RADIOLOGIA ODOCTOLOGICA
    async findById(crirad_odon_id: number): Promise<CriterioRadiologiaOdontoEntity> {
        const cri_radiolo = await this.criterioRadiologiaOdontoRepository.findOne({ where: { crirad_odon_id } });
        if (!cri_radiolo) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_radiolo;
    }

    //ELIMINAR CRITERIO RADIOLOGIA ODOCTOLOGICA
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const cri_radiolo = await this.findById(id);

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
            await this.criterioRadiologiaOdontoRepository.delete(cri_radiolo.crirad_odon_id)
            await this.auditoria_eliminacion_services.logDeleteRadioOdondologica(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                year
            );

            return new MessageDto(`Criterio Eliminado`);
        } catch (error) {
            // Aquí puedes manejar el error como desees, por ejemplo, registrarlo o lanzar una excepción personalizada.
            throw error;
        }

    }

    async update(id: number, payloads: { dto: CriterioRadiologiaOdontoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_radio_odont = await this.findById(id);
            if (!criterio_radio_odont) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crirad_odon_modalidad ? criterio_radio_odont.crirad_odon_modalidad = dto.crirad_odon_modalidad : criterio_radio_odont.crirad_odon_modalidad = criterio_radio_odont.crirad_odon_modalidad;
            dto.crirad_odon_complejidad ? criterio_radio_odont.crirad_odon_complejidad = dto.crirad_odon_complejidad : criterio_radio_odont.crirad_odon_complejidad = criterio_radio_odont.crirad_odon_complejidad;
            criterio_radio_odont.crirad_odon_articulo = dto.crirad_odon_articulo !== undefined ? dto.crirad_odon_articulo : "";
            dto.crirad_odon_nombre_criterio ? criterio_radio_odont.crirad_odon_nombre_criterio = dto.crirad_odon_nombre_criterio : criterio_radio_odont.crirad_odon_nombre_criterio = criterio_radio_odont.crirad_odon_nombre_criterio;

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

            await this.criterioRadiologiaOdontoRepository.save(criterio_radio_odont);
            await this.auditoria_actualizacion_services.logUpdateRadioOdondologica(
                payloadInterface.usu_nombre,
                payloadInterface.usu_apellido,
                'ip',
                year
            );

            return new MessageDto(`El criterio ha sido Actualizado`);
        } catch (error) {
            // Aquí puedes manejar el error como desees, por ejemplo, registrarlo o lanzar una excepción personalizada.
            throw error;
        }
    }
}
