import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioImgRadNoIonizantesEntity } from '../criterio_img_rad_noionizantes.entity';
import { CriterioImgRadNoIonizanteRepository } from '../criterio_img_rad_noionizantes.repository';
import { CumplimientoImgRadNoIonizanteEntity } from '../cumplimiento_img_rad_noionizantes.entity';
import { CumplimientoImgRadNoIonizanteRepository } from '../cumplimiento_img_rad_noionizantes.repository';
import { CumplimientoImgRadNoIonizantesDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/imagenes_diagnosticas_rad_noionizantes_dto/cumplimiento_img_rad_noionizantes.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoImgRadNoionizantesService {

    constructor(
        @InjectRepository(CumplimientoImgRadNoIonizanteEntity)
        private readonly cumplimientoImgRadNoIonizanteRepository: CumplimientoImgRadNoIonizanteRepository,
        @InjectRepository(CriterioImgRadNoIonizantesEntity)
        private readonly criterioImgRadNoIonizanteRepository: CriterioImgRadNoIonizanteRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_img_noion_id: number): Promise<CumplimientoImgRadNoIonizanteEntity> {
        const cumplimiento = await this.cumplimientoImgRadNoIonizanteRepository.findOne({ where: { cump_img_noion_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    
    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoImgRadNoIonizanteEntity[]> {
        const cumplimiento = await this.cumplimientoImgRadNoIonizanteRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_img_rad_noion.cri_img_noioni_nombre_criterio','imgrad_noionizante.imgrad_noion_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_img_rad_noion', 'criterio_img_rad_noion')
            .innerJoin('cumplimiento.cump_eva_ima_noioniza', 'cump_eva_ima_noioniza')
            .innerJoin('criterio_img_rad_noion.imgrad_noionizante', 'imgrad_noionizante')
            .where('cump_eva_ima_noioniza.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(cri_img_noioni_id: number, eva_id: number, dto: CumplimientoImgRadNoIonizantesDto): Promise<any> {
        const criterio = await this.criterioImgRadNoIonizanteRepository.findOne({ where: { cri_img_noioni_id: cri_img_noioni_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoImgRadNoIonizanteRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_img_rad_noion = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_ima_noioniza = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoImgRadNoIonizanteRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CUMPLIMIENTO IMAGEN NO IONIZANTE
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoImgRadNoIonizanteRepository.delete(cumplimiento.cump_img_noion_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO IMAGEN NO IONIZANTE
    async updateCapacidad(id: number, dto: CumplimientoImgRadNoIonizantesDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_img_noion_cumple ? cumplimiento.cump_img_noion_cumple = dto.cump_img_noion_cumple : cumplimiento.cump_img_noion_cumple = cumplimiento.cump_img_noion_cumple;
        dto.cump_img_noion_hallazgo ? cumplimiento.cump_img_noion_hallazgo = dto.cump_img_noion_hallazgo : cumplimiento.cump_img_noion_hallazgo = cumplimiento.cump_img_noion_hallazgo;
        dto.cump_img_noion_accion ? cumplimiento.cump_img_noion_accion = dto.cump_img_noion_accion : cumplimiento.cump_img_noion_accion = cumplimiento.cump_img_noion_accion;
        dto.cump_img_noion_responsable ? cumplimiento.cump_img_noion_responsable = dto.cump_img_noion_responsable : cumplimiento.cump_img_noion_responsable = cumplimiento.cump_img_noion_responsable;
        dto.cump_img_noion_fecha_limite ? cumplimiento.cump_img_noion_fecha_limite = dto.cump_img_noion_fecha_limite : cumplimiento.cump_img_noion_fecha_limite = cumplimiento.cump_img_noion_fecha_limite;
        
        await this.cumplimientoImgRadNoIonizanteRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
