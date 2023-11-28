import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriterioDiagnostVascularEntity } from '../criterio_diagnost_vascular.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioDiagnostVascularRepository } from '../criterio_diagnost_vascular.repository';
import { DiagnosticoVascularEntity } from '../diagnostico_vascular.entity';
import { DiagnosticoVascularRepository } from '../diagnostico_vascular.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioDiagnostVascularDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/diagnostico_vascular_dto/criterio_diagnostico_vascular.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/auth/payload.interface';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';


@Injectable()
export class CriterioDiagnostVascularService {
    constructor(
        @InjectRepository(CriterioDiagnostVascularEntity)
        private readonly criterioDiagnostVascularRepository: CriterioDiagnostVascularRepository,
        @InjectRepository(DiagnosticoVascularEntity)
        private readonly diagnosticoVascularRepository: DiagnosticoVascularRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }

    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioDiagnostVascularEntity[]> {
        const cri_diagnos_vascu = await this.criterioDiagnostVascularRepository.createQueryBuilder('criterio')
            .select(['criterio', 'diagnostico_vascular.diag_vas_nombre_estandar'])
            .innerJoin('criterio.diagnostico_vascular', 'diagnostico_vascular')
            .where('diagnostico_vascular.diag_vas_id = :dial_est', { dial_est: id })
            .getMany()
        if (!cri_diagnos_vascu) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_diagnos_vascu
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioDiagnostVascularEntity[]> {
        const criterio = await this.criterioDiagnostVascularRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //METODO AGREGAR CRITERIO-DIAGNOSTICO VASCULAR
    async createCriDiag(diag_vas_id: number, payloads: { dto: CriterioDiagnostVascularDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const diagnostVascular = await this.diagnosticoVascularRepository.findOne({ where: { diag_vas_id: diag_vas_id } });
            if (!diagnostVascular) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criterioDiagnostVascular = this.criterioDiagnostVascularRepository.create(dto);

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criterioDiagnostVascular.diagnostico_vascular = diagnostVascular;

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioDiagnostVascularRepository.save(criterioDiagnostVascular);
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

            await this.criterioDiagnostVascularRepository.save(criterioDiagnostVascular);
            await this.auditoria_registro_services.logCreateDiagnostico(
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


    //ENCONTRAR POR ID - CRITERIO GIAGNOSTICO VASCULAR
    async findById(crivac_id: number): Promise<CriterioDiagnostVascularEntity> {
        const cri_diagnos_vascu = await this.criterioDiagnostVascularRepository.findOne({ where: { crivac_id } });
        if (!cri_diagnos_vascu) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_diagnos_vascu;
    }

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number, tokenDto: TokenDto ): Promise<any> {
        try {
            const cri_diagnos_vascu = await this.findById(id);

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
            await this.criterioDiagnostVascularRepository.delete(cri_diagnos_vascu.crivac_id)
            await this.auditoria_eliminacion_services.logDeleteDiagnostico(
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

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateVascular(id: number, payloads: { dto: CriterioDiagnostVascularDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_diagnost_vascular = await this.findById(id);
            if (!criterio_diagnost_vascular) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cridiagv_modalidad ? criterio_diagnost_vascular.cridiagv_modalidad = dto.cridiagv_modalidad : criterio_diagnost_vascular.cridiagv_modalidad = criterio_diagnost_vascular.cridiagv_modalidad;
            dto.cridiagv_complejidad ? criterio_diagnost_vascular.cridiagv_complejidad = dto.cridiagv_complejidad : criterio_diagnost_vascular.cridiagv_complejidad = criterio_diagnost_vascular.cridiagv_complejidad;
            criterio_diagnost_vascular.cridiagv_articulo = dto.cridiagv_articulo !== undefined ? dto.cridiagv_articulo : "";
            dto.cridiagv_nombre_criterio ? criterio_diagnost_vascular.cridiagv_nombre_criterio = dto.cridiagv_nombre_criterio : criterio_diagnost_vascular.cridiagv_nombre_criterio;

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

            await this.criterioDiagnostVascularRepository.save(criterio_diagnost_vascular);
            await this.auditoria_actualizacion_services.logUpdateDiagnostico(
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
