import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CumplimientoImgRadIonizanteEntity } from '../cumplimiento_img_rad_ionizantes.entity';
import { CumplimientoImgRadIonizanteRepository } from '../cumplimiento_img_rad_ionizantes.repository';
import { CriterioImgRadIonizantesEntity } from '../criterio_img_rad_ionizantes.entity';
import { CriterioImgRadIonizanteRepository } from '../criterio_img_rad_ionizantes.repository';
import { CumplimientoImgRadIonizantesDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/imagenes_diagnosticas_rad_ionizantes_dto/cumplimiento_img_rad_ionizantes.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoImgRadIonizantesService {

    constructor(
        @InjectRepository(CumplimientoImgRadIonizanteEntity)
        private readonly cumplimientoImgRadIonizanteRepository: CumplimientoImgRadIonizanteRepository,
        @InjectRepository(CriterioImgRadIonizantesEntity)
        private readonly criterioImgRadIonizanteRepository: CriterioImgRadIonizanteRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_imgion_id: number): Promise<CumplimientoImgRadIonizanteEntity> {
        const cumplimiento = await this.cumplimientoImgRadIonizanteRepository.findOne({ where: { cump_imgion_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

   //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoImgRadIonizanteEntity[]> {
        const cumplimiento = await this.cumplimientoImgRadIonizanteRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_img_rad_ion.cri_imgioni_nombre_criterio','imgrad_ionizante.imgradion_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_img_rad_ion', 'criterio_img_rad_ion')
            .innerJoin('cumplimiento.cump_eva_ima_ioniza', 'cump_eva_ima_ioniza')
            .innerJoin('criterio_img_rad_ion.imgrad_ionizante', 'imgrad_ionizante')
            .where('cump_eva_ima_ioniza.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(cri_imgioni_id: number, eva_id: number, dto: CumplimientoImgRadIonizantesDto): Promise<any> {
        const criterio = await this.criterioImgRadIonizanteRepository.findOne({ where: { cri_imgioni_id: cri_imgioni_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoImgRadIonizanteRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_img_rad_ion = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_ima_ioniza = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoImgRadIonizanteRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CUMPLIMIENTO IMAGEN IONIZANTE
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoImgRadIonizanteRepository.delete(cumplimiento.cump_imgion_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO IMAGEN IONIZANTE
    async updateCapacidad(id: number, dto: CumplimientoImgRadIonizantesDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_imgion_cumple ? cumplimiento.cump_imgion_cumple = dto.cump_imgion_cumple : cumplimiento.cump_imgion_cumple = cumplimiento.cump_imgion_cumple;
        dto.cump_imgion_hallazgo ? cumplimiento.cump_imgion_hallazgo = dto.cump_imgion_hallazgo : cumplimiento.cump_imgion_hallazgo = cumplimiento.cump_imgion_hallazgo;
        dto.cump_imgion_accion ? cumplimiento.cump_imgion_accion = dto.cump_imgion_accion : cumplimiento.cump_imgion_accion = cumplimiento.cump_imgion_accion;
        dto.cump_imgion_responsable ? cumplimiento.cump_imgion_responsable = dto.cump_imgion_responsable : cumplimiento.cump_imgion_responsable = cumplimiento.cump_imgion_responsable;
        dto.cump_imgion_fecha_limite ? cumplimiento.cump_imgion_fecha_limite = dto.cump_imgion_fecha_limite : cumplimiento.cump_imgion_fecha_limite = cumplimiento.cump_imgion_fecha_limite;
        
        await this.cumplimientoImgRadIonizanteRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
