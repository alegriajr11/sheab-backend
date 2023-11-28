import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioPrehospitalariaEntity } from '../criterio_prehospitalaria.entity';
import { PrehospitalariaEntity } from '../prehospitalaria.entity';
import { PrehospitalariaRepository } from '../prehospitalaria.repository';
import { CriterioPrehospitalariaRepository } from '../criterio_prehospitalaria.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioPrehospitalariaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/prehospitalaria_dto/criterio_prehospitalaria.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosPrehospitalariaService {

    constructor(
        @InjectRepository(CriterioPrehospitalariaEntity)
        private readonly criterioPrehospitalariaRepository: CriterioPrehospitalariaRepository,
        @InjectRepository(PrehospitalariaEntity)
        private readonly prehospitalariaRepository: PrehospitalariaRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioPrehospitalariaEntity[]> {
        const cri_prehos = await this.criterioPrehospitalariaRepository.createQueryBuilder('criterio')
            .select(['criterio', 'prehospitalaria.parto_nombre_estandar'])
            .innerJoin('criterio.prehospitalaria', 'prehospitalaria')
            .where('prehospitalaria.parto_id = :prehos_est', { prehos_est: id })
            .getMany()
        if (!cri_prehos) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_prehos
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioPrehospitalariaEntity[]> {
        const criterio = await this.criterioPrehospitalariaRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(parto_id: number, payloads: { dto: CriterioPrehospitalariaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const prehospita = await this.prehospitalariaRepository.findOne({ where: { parto_id: parto_id } });
            if (!prehospita) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioprehospita = this.criterioPrehospitalariaRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioprehospita.prehospitalaria = prehospita

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

            await this.criterioPrehospitalariaRepository.save(criterioprehospita)
            await this.auditoria_registro_services.logCreatePrehospitalaria(
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

    //ENCONTRAR POR ID - CRITERIO PREHOSPITALARIA   
    async findById(cripreh_id: number): Promise<CriterioPrehospitalariaEntity> {
        const criterio_prehospi = await this.criterioPrehospitalariaRepository.findOne({ where: { cripreh_id } });
        if (!criterio_prehospi) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_prehospi;
    }

    //ELIMINAR CRITERIO PREHOSPITALARIA 
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_prehospi = await this.findById(id);

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
            await this.criterioPrehospitalariaRepository.delete(criterio_prehospi.cripreh_id)
            await this.auditoria_eliminacion_services.logDeletePrehospitalaria(
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

    //ACTUALIZAR PREHOSPITALARIA 
    async update(id: number, payloads: { dto: CriterioPrehospitalariaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_prehospi = await this.findById(id);
            if (!criterio_prehospi) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }
            dto.cripreh_modalidad ? criterio_prehospi.cripreh_modalidad = dto.cripreh_modalidad : criterio_prehospi.cripreh_modalidad = criterio_prehospi.cripreh_modalidad;
            dto.cripreh_complejidad ? criterio_prehospi.cripreh_complejidad = dto.cripreh_complejidad : criterio_prehospi.cripreh_complejidad = criterio_prehospi.cripreh_complejidad;
            criterio_prehospi.cripreh_articulo = dto.cripreh_articulo !== undefined ? dto.cripreh_articulo : "";
            dto.cripreh_nombre_criterio ? criterio_prehospi.cripreh_nombre_criterio = dto.cripreh_nombre_criterio : criterio_prehospi.cripreh_nombre_criterio = criterio_prehospi.cripreh_nombre_criterio;
    
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

            await this.criterioPrehospitalariaRepository.save(criterio_prehospi);
            await this.auditoria_actualizacion_services.logUpdatePrehospitalaria(
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
