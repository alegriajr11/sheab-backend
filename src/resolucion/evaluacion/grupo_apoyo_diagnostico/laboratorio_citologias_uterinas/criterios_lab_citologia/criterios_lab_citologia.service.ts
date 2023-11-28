import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriterioLabUterinaEntity } from '../criterio_lab_citologia_uterina.entity';
import { CriterioLabUterinaRepository } from '../criterio_lab_citologia_uterina.repository';
import { LabCitologiaUterinaEntity } from '../lab_citologia_uterina.entity';
import { LabCitologiaUterinaRepository } from '../lab_citologia_uterina.repository';
import { MessageDto } from 'src/common/message.dto';
import { CriterioLabUterinaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/laboratorio_citologias_uterinas_dto/criterio_lab_citologia_uterina.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';

@Injectable()
export class CriteriosLabCitologiaService {

    constructor(
        @InjectRepository(CriterioLabUterinaEntity)
        private readonly criterioLabUterinaRepository: CriterioLabUterinaRepository,
        @InjectRepository(LabCitologiaUterinaEntity)
        private readonly labCitologiaUterinaRepository: LabCitologiaUterinaRepository,
        private readonly jwtService: JwtService,
        private readonly auditoria_registro_services: AuditoriaRegistroService,
        private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
        private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
    ) { }


    //LISTANDO CRITERIOS POR ESTANDAR
    async getCriterioForEstandar(id: number): Promise<CriterioLabUterinaEntity[]> {
        const cri_lab_cito_ute = await this.criterioLabUterinaRepository.createQueryBuilder('criterio')
            .select(['criterio', 'lab_cit_uterina.labcit_uter_nombre_estandar'])
            .innerJoin('criterio.lab_cit_uterina', 'lab_cit_uterina')
            .where('lab_cit_uterina.labcit_uter_id = :uter_est', { uter_est: id })
            .getMany()
        if (!cri_lab_cito_ute) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cri_lab_cito_ute
    }

    //LISTAR TODOS CRITERIOS
    async getall(): Promise<CriterioLabUterinaEntity[]> {
        const criterio = await this.criterioLabUterinaRepository.createQueryBuilder('criterios')
            .select(['criterios'])
            .getMany()
        if (criterio.length === 0) throw new NotFoundException(new MessageDto('No hay criterios  en la lista'))
        return criterio;
    }

    //METODO AGREGAR  CRITERIO CITOLOGIAS UTERINAS
    async create(labcit_uter_id: number, payloads: { dto: CriterioLabUterinaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const citouterinas = await this.labCitologiaUterinaRepository.findOne({ where: { labcit_uter_id: labcit_uter_id } });
            if (!citouterinas) {
                throw new InternalServerErrorException(new MessageDto('El Estandar no ha sido creado'));
            }

            //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
            const criteriocitouterinas = this.criterioLabUterinaRepository.create(dto)

            //ASIGNAMOS EL ESTANDAR AL CRITERIO
            criteriocitouterinas.lab_cit_uterina = citouterinas

            //GUARDAR LOS DATOS EN LA BD
            await this.criterioLabUterinaRepository.save(criteriocitouterinas)
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

            await this.criterioLabUterinaRepository.save(criteriocitouterinas)
            await this.auditoria_registro_services.logCreateLabCitoUterinas(
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

    //ENCONTRAR POR ID - CRITERIO CITOLOGIAS UTERINAS
    async findById(cri_lab_ute_id: number): Promise<CriterioLabUterinaEntity> {
        const cri_citolo_ute = await this.criterioLabUterinaRepository.findOne({ where: { cri_lab_ute_id } });
        if (!cri_citolo_ute) {
            throw new NotFoundException(new MessageDto('El Criterio No Existe'));
        }
        return cri_citolo_ute;
    }

    //ELIMINAR CRITERIO CITOLOGIAS UTERINAS
    async delete(id: number, tokenDto: TokenDto ): Promise<any> {
        try {
            const cri_citolo_ute = await this.findById(id);

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
            await this.criterioLabUterinaRepository.delete(cri_citolo_ute.cri_lab_ute_id)
            await this.auditoria_eliminacion_services.logDeleteLabCitoUterinas(
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

    //ACTUALIZAR CRITERIOS  CITOLOGIAS UTERINAS
    async update(id: number, payloads: { dto: CriterioLabUterinaDto, tokenDto: TokenDto }): Promise<any> {
        try {
            const { dto, tokenDto } = payloads;
            const criterio_lab_citologia_uterina = await this.findById(id);
            if (!criterio_lab_citologia_uterina) {
                throw new NotFoundException(new MessageDto('El criterio no existe'));
            }

            dto.cri_lab_ute_modalidad ? criterio_lab_citologia_uterina.cri_lab_ute_modalidad = dto.cri_lab_ute_modalidad : criterio_lab_citologia_uterina.cri_lab_ute_modalidad = criterio_lab_citologia_uterina.cri_lab_ute_modalidad;
            dto.cri_lab_ute_complejidad ? criterio_lab_citologia_uterina.cri_lab_ute_complejidad = dto.cri_lab_ute_complejidad : criterio_lab_citologia_uterina.cri_lab_ute_complejidad = criterio_lab_citologia_uterina.cri_lab_ute_complejidad;
            criterio_lab_citologia_uterina.cri_lab_ute_articulo = dto.cri_lab_ute_articulo !== undefined ? dto.cri_lab_ute_articulo : "";
            dto.cri_lab_ute_nombre_criterio ? criterio_lab_citologia_uterina.cri_lab_ute_nombre_criterio = dto.cri_lab_ute_nombre_criterio : criterio_lab_citologia_uterina.cri_lab_ute_nombre_criterio = criterio_lab_citologia_uterina.cri_lab_ute_nombre_criterio;
    
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

            await this.criterioLabUterinaRepository.save(criterio_lab_citologia_uterina);
            await this.auditoria_actualizacion_services.logUpdateLabCitoUterinas(
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
