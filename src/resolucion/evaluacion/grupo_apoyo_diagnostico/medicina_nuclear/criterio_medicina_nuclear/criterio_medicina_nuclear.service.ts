import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioMedicinaNuclearEntity } from '../criterio_medicina_nuclear.entity';
import { CriterioMedicinaNuclearRepository } from '../criterio_medicina_nuclear.repository';
import { MedNuclearEntity } from '../medicina_nuclear.entity';
import { MedNuclearRepository } from '../medicina_nuclear.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioMedicinaNuclearDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/medicina_nuclear_dto/criterio_medicina_nuclear.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { PayloadInterface } from 'src/auth/payload.interface';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class CriterioMedicinaNuclearService {

    constructor(
        @InjectRepository(CriterioMedicinaNuclearEntity)
        private readonly criterioMedicinaNuclearRepository: CriterioMedicinaNuclearRepository,
        @InjectRepository(MedNuclearEntity)
        private readonly medNuclearRepository: MedNuclearRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioMedicinaNuclearEntity[]> {
        const cri_med_nuc = await this.criterioMedicinaNuclearRepository.createQueryBuilder('criterio')
            .select(['criterio', 'med_nuclear.med_nucl_nombre_estandar'])
            .innerJoin('criterio.med_nuclear', 'med_nuclear')
            .where('med_nuclear.med_nucl_id = :nuc_est', { nuc_est: id })
            .getMany()
        if (!cri_med_nuc) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_med_nuc
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioMedicinaNuclearEntity[]> {
        const criterio = await this.criterioMedicinaNuclearRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //METODO AGREGAR CRITERIO-MEDICINA NUCLEAR
    async create(med_nucl_id: number, payloads: { dto: CriterioMedicinaNuclearDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const mednuclear = await this.medNuclearRepository.findOne({ where: { med_nucl_id: med_nucl_id } });
            if (!mednuclear) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriomednuclear = this.criterioMedicinaNuclearRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriomednuclear.med_nuclear = mednuclear

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioMedicinaNuclearRepository.save(criteriomednuclear)
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
            await this.auditoria_registro_services.logCreateMedNuclear(
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

    //ENCONTRAR POR ID - CRITERIO MEDICINA NUCLEAR
    async findById(crimed_nucl_id: number): Promise<CriterioMedicinaNuclearEntity> {
        const cri_medi_nucl = await this.criterioMedicinaNuclearRepository.findOne({ where: { crimed_nucl_id } });
        if (!cri_medi_nucl) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_medi_nucl;
    }

    //ELIMINAR CRITERIO MEDICINA NUCLEAR
    async delete(id: number, tokenDto: TokenDto ): Promise<any> {
        try {
            const cri_medi_nucl = await this.findById(id);

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
            await this.criterioMedicinaNuclearRepository.delete(cri_medi_nucl.crimed_nucl_id)
            await this.auditoria_eliminacion_services.logDeleteMedNuclear(
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

    //ACTUALIZAR CRITERIOS  MEDICINA NUCLEAR 
    async update(id: number, payloads: { dto: CriterioMedicinaNuclearDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_medicina_nuclear = await this.findById(id);
            if (!criterio_medicina_nuclear) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.crimed_nucl_modalidad ? criterio_medicina_nuclear.crimed_nucl_modalidad = dto.crimed_nucl_modalidad : criterio_medicina_nuclear.crimed_nucl_modalidad = criterio_medicina_nuclear.crimed_nucl_modalidad;
            dto.crimed_nucl_complejidad ? criterio_medicina_nuclear.crimed_nucl_complejidad = dto.crimed_nucl_complejidad : criterio_medicina_nuclear.crimed_nucl_complejidad = criterio_medicina_nuclear.crimed_nucl_complejidad;
            criterio_medicina_nuclear.crimed_nucl_articulo = dto.crimed_nucl_articulo !== undefined ? dto.crimed_nucl_articulo : "";
            dto.crimed_nucl_nombre_criterio ? criterio_medicina_nuclear.crimed_nucl_nombre_criterio = dto.crimed_nucl_nombre_criterio : criterio_medicina_nuclear.crimed_nucl_nombre_criterio = criterio_medicina_nuclear.crimed_nucl_nombre_criterio;
    
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

            await this.criterioMedicinaNuclearRepository.save(criterio_medicina_nuclear);
            await this.auditoria_actualizacion_services.logUpdateMedNuclear(
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
