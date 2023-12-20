import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioHospitalizacionMentalEntity } from '../criterio_hosp_salud_mental.entity';
import { CriterioHospitalizacionMentalRepository } from '../criterio_hosp_salud_mental.repository';
import { CumplimientoHospitalizacionMentalEntity } from '../cumplimiento_hosp_salud_mental.entity';
import { CumplimientoHospitalizacionMentalRepository } from '../cumplimiento_hosp_salud_mental.repository';
import { CumplimientoHospitalizacionMentalDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_salud_mental_dto/cumplimiento_hosp_salud_mental.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';


@Injectable()
export class CumplimientoHospSaludMentalService {

    constructor(
        @InjectRepository(CumplimientoHospitalizacionMentalEntity)
        private readonly cumplimientoHospitalizacionMentalRepository: CumplimientoHospitalizacionMentalRepository,
        @InjectRepository(CriterioHospitalizacionMentalEntity)
        private readonly criterioHospitalizacionMentalRepository: CriterioHospitalizacionMentalRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_hosp_ment_id: number): Promise<CumplimientoHospitalizacionMentalEntity> {
        const cumplimiento = await this.cumplimientoHospitalizacionMentalRepository.findOne({ where: { cump_hosp_ment_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoHospitalizacionMentalEntity[]> {
        const cumplimiento = await this.cumplimientoHospitalizacionMentalRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_hospitalizacion_mental.crihosp_ment_nombre_criterio', 'hospitalizacion_mental.hosp_mental_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_hospitalizacion_mental', 'criterio_hospitalizacion_mental')
            .innerJoin('cumplimiento.cump_eva_hospi_mental', 'cump_eva_hospi_mental')
            .innerJoin('criterio_hospitalizacion_mental.hospitalizacion_mental', 'hospitalizacion_mental')
            .where('cump_eva_hospi_mental.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(crihosp_ment_id: number, eva_id: number, dto: CumplimientoHospitalizacionMentalDto): Promise<any> {
        const criterio = await this.criterioHospitalizacionMentalRepository.findOne({ where: { crihosp_ment_id: crihosp_ment_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoHospitalizacionMentalRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_hospitalizacion_mental = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_hospi_mental = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoHospitalizacionMentalRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR CUMPLIMIENTO HOSPITALIZACION SALUD MENTAL
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoHospitalizacionMentalRepository.delete(cumplimiento.cump_hosp_ment_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO HOSPITALIZACION SALUD MENTAL
    async updateCapacidad(id: number, dto: CumplimientoHospitalizacionMentalDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_hosp_ment_cumple ? cumplimiento.cump_hosp_ment_cumple = dto.cump_hosp_ment_cumple : cumplimiento.cump_hosp_ment_cumple = cumplimiento.cump_hosp_ment_cumple;
        dto.cump_hosp_ment_hallazgo ? cumplimiento.cump_hosp_ment_hallazgo = dto.cump_hosp_ment_hallazgo : cumplimiento.cump_hosp_ment_hallazgo = cumplimiento.cump_hosp_ment_hallazgo;
        dto.cump_hosp_ment_accion ? cumplimiento.cump_hosp_ment_accion = dto.cump_hosp_ment_accion : cumplimiento.cump_hosp_ment_accion = cumplimiento.cump_hosp_ment_accion;
        dto.cump_hosp_ment_responsable ? cumplimiento.cump_hosp_ment_responsable = dto.cump_hosp_ment_responsable : cumplimiento.cump_hosp_ment_responsable = cumplimiento.cump_hosp_ment_responsable;
        dto.cump_hosp_ment_fecha_limite ? cumplimiento.cump_hosp_ment_fecha_limite = dto.cump_hosp_ment_fecha_limite : cumplimiento.cump_hosp_ment_fecha_limite = cumplimiento.cump_hosp_ment_fecha_limite;

        await this.cumplimientoHospitalizacionMentalRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
