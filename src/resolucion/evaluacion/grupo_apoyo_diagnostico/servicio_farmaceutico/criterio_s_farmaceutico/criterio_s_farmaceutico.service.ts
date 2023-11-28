import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioSerFarmaceuticoEntity } from '../criterios_s_farmaceutico.entity';
import { ServFarmaceuticoEntity } from '../servicio_farmaceutico.entity';
import { CriterioSerFarmaceuticoRepository } from '../criterios_s_farmaceutico.repository';
import { ServFarmaceuticoRepository } from '../servicio_farmaceutico.repository';
import { CriterioSerFarmaceuticoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/servicio_farmaceutico_dto/criterios_s_farmaceutico.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriterioSFarmaceuticoService {


    constructor(
        @InjectRepository(CriterioSerFarmaceuticoEntity)
        private readonly criterioSerFarmaceuticoRepository: CriterioSerFarmaceuticoRepository,
        @InjectRepository(ServFarmaceuticoEntity)
        private readonly servFarmaceuticoRepository: ServFarmaceuticoRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioSerFarmaceuticoEntity[]> {
        const cri_farma = await this.criterioSerFarmaceuticoRepository.createQueryBuilder('criterio')
            .select(['criterio', 'ser_farmaceutico.ser_farma_nombre_estandar'])
            .innerJoin('criterio.ser_farmaceutico', 'ser_farmaceutico')
            .where('ser_farmaceutico.ser_farma_id = :farm_est', { farm_est: id })
            .getMany()
        if (!cri_farma) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_farma
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioSerFarmaceuticoEntity[]> {
        const criterio = await this.criterioSerFarmaceuticoRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO SERVICIO FARMACEUTICO
    async create(ser_farma_id: number, payloads: { dto: CriterioSerFarmaceuticoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const servifarma = await this.servFarmaceuticoRepository.findOne({ where: { ser_farma_id: ser_farma_id } });
            if (!servifarma) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioservifarma = this.criterioSerFarmaceuticoRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioservifarma.ser_farmaceutico = servifarma

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

            await this.criterioSerFarmaceuticoRepository.save(criterioservifarma)
            await this.auditoria_registro_services.logCreateServFarmaceutico(
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

    //ENCONTRAR POR ID - CRITERIO SERVICIO FARMACEUTICO
    async findById(criser_farm_id: number): Promise<CriterioSerFarmaceuticoEntity> {
        const criterio_ser_farm = await this.criterioSerFarmaceuticoRepository.findOne({ where: { criser_farm_id } });
        if (!criterio_ser_farm) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_ser_farm;
    }

    //ELIMINAR CRITERIO SERVICIO FARMACEUTICO
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_ser_farm = await this.findById(id);

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
            await this.criterioSerFarmaceuticoRepository.delete(criterio_ser_farm.criser_farm_id)
            await this.auditoria_eliminacion_services.logDeleteServFarmaceutico(
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

   
    async update(id: number, payloads: { dto: CriterioSerFarmaceuticoDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_ser_farm = await this.findById(id);
            if (!criterio_ser_farm) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.criser_farm_modalidad ? criterio_ser_farm.criser_farm_modalidad = dto.criser_farm_modalidad : criterio_ser_farm.criser_farm_modalidad = criterio_ser_farm.criser_farm_modalidad;
            dto.criser_farm_complejidad ? criterio_ser_farm.criser_farm_complejidad = dto.criser_farm_complejidad : criterio_ser_farm.criser_farm_complejidad = criterio_ser_farm.criser_farm_complejidad;
            criterio_ser_farm.criser_farm_articulo = dto.criser_farm_articulo !== undefined ? dto.criser_farm_articulo : "";
            dto.criser_farm_nombre_criterio ? criterio_ser_farm.criser_farm_nombre_criterio = dto.criser_farm_nombre_criterio : criterio_ser_farm.criser_farm_nombre_criterio = criterio_ser_farm.criser_farm_nombre_criterio;

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

            await this.criterioSerFarmaceuticoRepository.save(criterio_ser_farm);
            await this.auditoria_actualizacion_services.logUpdateServFarmaceutico(
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
