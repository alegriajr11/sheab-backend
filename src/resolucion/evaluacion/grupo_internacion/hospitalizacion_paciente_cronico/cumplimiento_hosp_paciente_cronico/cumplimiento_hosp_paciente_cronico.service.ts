import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioHospitCronicoEntity } from '../criterio_hosp_paciente_cron.entity';
import { CriterioHospitCronicoRepository } from '../criterio_hosp_paciente_cron.repository';
import { CumplimientoHospitCronicoEntity } from '../cumplimiento_hosp_paciente_cron.entity';
import { CumplimientoHospitCronicoRepository } from '../cumplimiento_hosp_paciente_cron.repository';
import { CumplimientoHospitCronicoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_internacion_dtos/hospitalizacion_paciente_cronico_dto/cumplimiento_hosp_paciente_cron.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoHospPacienteCronicoService {

    constructor(
        @InjectRepository(CumplimientoHospitCronicoEntity)
        private readonly CumplimientoHospitCronicoRepository: CumplimientoHospitCronicoRepository,
        @InjectRepository(CriterioHospitCronicoEntity)
        private readonly criterioHospitCronicoRepository: CriterioHospitCronicoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_hosp_cron_id: number): Promise<CumplimientoHospitCronicoEntity> {
        const cumplimiento = await this.CumplimientoHospitCronicoRepository.findOne({ where: { cump_hosp_cron_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoHospitCronicoEntity[]> {
        const cumplimiento = await this.CumplimientoHospitCronicoRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_hospit_cronico.crihosp_cron_nombre_criterio', 'hospit_cronico.hosp_cron_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_hospit_cronico', 'criterio_hospit_cronico')
            .innerJoin('cumplimiento.cump_eva_hospi_cronico', 'cump_eva_hospi_cronico')
            .innerJoin('criterio_hospit_cronico.hospit_cronico', 'hospit_cronico')
            .where('cump_eva_hospi_cronico.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }
    
    //METODO CREAR CUMPLIMIENTO
    async create(crihosp_cron_id: number, eva_id: number, dto: CumplimientoHospitCronicoDto): Promise<any> {
        const criterio = await this.criterioHospitCronicoRepository.findOne({ where: { crihosp_cron_id: crihosp_cron_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.CumplimientoHospitCronicoRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_hospit_cronico = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_hospi_cronico = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.CumplimientoHospitCronicoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CUMPLIMIENTO HOSPITALIZACION PACIENTE CRONICO
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.CumplimientoHospitCronicoRepository.delete(cumplimiento.cump_hosp_cron_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CUMPLIMIENTO HOSPITALIZACION PACIENTE CRONICO
    async updateCapacidad(id: number, dto: CumplimientoHospitCronicoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_hosp_cron_cumple ? cumplimiento.cump_hosp_cron_cumple = dto.cump_hosp_cron_cumple : cumplimiento.cump_hosp_cron_cumple = cumplimiento.cump_hosp_cron_cumple;
        dto.cump_hosp_cron_hallazgo ? cumplimiento.cump_hosp_cron_hallazgo = dto.cump_hosp_cron_hallazgo : cumplimiento.cump_hosp_cron_hallazgo = cumplimiento.cump_hosp_cron_hallazgo;
        dto.cump_hosp_cron_accion ? cumplimiento.cump_hosp_cron_accion = dto.cump_hosp_cron_accion : cumplimiento.cump_hosp_cron_accion = cumplimiento.cump_hosp_cron_accion;
        dto.cump_hosp_cron_responsable ? cumplimiento.cump_hosp_cron_responsable = dto.cump_hosp_cron_responsable : cumplimiento.cump_hosp_cron_responsable = cumplimiento.cump_hosp_cron_responsable;
        dto.cump_hosp_cron_fecha_limite ? cumplimiento.cump_hosp_cron_fecha_limite = dto.cump_hosp_cron_fecha_limite : cumplimiento.cump_hosp_cron_fecha_limite = cumplimiento.cump_hosp_cron_fecha_limite;
        
        await this.CumplimientoHospitCronicoRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
