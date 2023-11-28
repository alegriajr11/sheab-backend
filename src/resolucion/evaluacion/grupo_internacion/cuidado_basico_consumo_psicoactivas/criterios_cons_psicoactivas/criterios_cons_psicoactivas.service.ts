import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioConsumoPsicoactivasEntity } from '../criterio_cuid_cons_psicoact.entity';
import { ConsumoPsicoactivasEntity } from '../cuid_consumo_psicoactivas.entity';
import { CriterioConsumoPsicoactivasRepository } from '../criterio_cuid_cons_psicoact.repository';
import { ConsumoPsicoactivasRepository } from '../cuid_consumo_psicoactivas.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioConsumoPsicoactivasDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/cuidado_basico_consumo_psicoactivas_dto/criterio_cuid_cons_psicoact.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosConsPsicoactivasService {

    constructor(
        @InjectRepository(CriterioConsumoPsicoactivasEntity)
        private readonly criterioConsumoPsicoactivasRepository: CriterioConsumoPsicoactivasRepository,
        @InjectRepository(ConsumoPsicoactivasEntity)
        private readonly consumoPsicoactivasRepository: ConsumoPsicoactivasRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioConsumoPsicoactivasEntity[]> {
        const cri_psico = await this.criterioConsumoPsicoactivasRepository.createQueryBuilder('criterio')
            .select(['criterio', 'cons_psicoactivas.cons_psi_nombre_estandar'])
            .innerJoin('criterio.cons_psicoactivas', 'cons_psicoactivas')
            .where('cons_psicoactivas.cons_psi_id = :psico_est', { psico_est: id })
            .getMany()
        if (!cri_psico) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_psico
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioConsumoPsicoactivasEntity[]> {
        const criterio = await this.criterioConsumoPsicoactivasRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //CREAR CRITERIO
    async create(cons_psi_id: number, payloads: { dto: CriterioConsumoPsicoactivasDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const conspsico = await this.consumoPsicoactivasRepository.findOne({ where: { cons_psi_id: cons_psi_id } });
            if (!conspsico) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriosconspsico = this.criterioConsumoPsicoactivasRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriosconspsico.cons_psicoactivas = conspsico

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

            await this.criterioConsumoPsicoactivasRepository.save(criteriosconspsico)
            await this.auditoria_registro_services.logCreateConsumoPsicoactivas(
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

    //ENCONTRAR POR ID - CRITERIO CUIDADO BASICO PSICOACTIVAS  
    async findById(cri_cons_psic_id: number): Promise<CriterioConsumoPsicoactivasEntity> {
        const criterio_cons_psic = await this.criterioConsumoPsicoactivasRepository.findOne({ where: { cri_cons_psic_id } });
        if (!criterio_cons_psic) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return criterio_cons_psic;
    }


    //ELIMINAR CRITERIO  CUIDADO BASICO PSICOACTIVAS
    async delete(id: number, tokenDto: TokenDto): Promise<any> {
        try {
            const criterio_cons_psic = await this.findById(id);

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
            await this.criterioConsumoPsicoactivasRepository.delete(criterio_cons_psic.cri_cons_psic_id)
            await this.auditoria_eliminacion_services.logDeleteConsumoPsicoactivas(
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

    //ACTUALIZAR CRITERIOS  CUIDADO BASICO PSICOACTIVAS 
    async update(id: number, payloads: { dto: CriterioConsumoPsicoactivasDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_cuid_cons_psicoact = await this.findById(id);
            if (!criterio_cuid_cons_psicoact) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_cons_psic_modalidad ? criterio_cuid_cons_psicoact.cri_cons_psic_modalidad = dto.cri_cons_psic_modalidad : criterio_cuid_cons_psicoact.cri_cons_psic_modalidad = criterio_cuid_cons_psicoact.cri_cons_psic_modalidad;
            dto.cri_cons_psic_complejidad ? criterio_cuid_cons_psicoact.cri_cons_psic_complejidad = dto.cri_cons_psic_complejidad : criterio_cuid_cons_psicoact.cri_cons_psic_complejidad = criterio_cuid_cons_psicoact.cri_cons_psic_complejidad;
            criterio_cuid_cons_psicoact.cri_cons_psic_articulo = dto.cri_cons_psic_articulo !== undefined ? dto.cri_cons_psic_articulo : "";
            dto.cri_cons_psic_nombre_criterio ? criterio_cuid_cons_psicoact.cri_cons_psic_nombre_criterio = dto.cri_cons_psic_nombre_criterio : criterio_cuid_cons_psicoact.cri_cons_psic_nombre_criterio = criterio_cuid_cons_psicoact.cri_cons_psic_nombre_criterio;

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

            await this.criterioConsumoPsicoactivasRepository.save(criterio_cuid_cons_psicoact);
            await this.auditoria_actualizacion_services.logUpdateConsumoPsicoactivas(
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
