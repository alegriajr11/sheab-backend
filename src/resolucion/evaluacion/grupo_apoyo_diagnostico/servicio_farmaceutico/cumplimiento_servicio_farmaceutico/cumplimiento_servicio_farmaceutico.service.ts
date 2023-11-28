import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioSerFarmaceuticoEntity } from '../criterios_s_farmaceutico.entity';
import { CriterioSerFarmaceuticoRepository } from '../criterios_s_farmaceutico.repository';
import { CumplimientoSerFarmaceuticoEntity } from '../cumplimiento_s_farmaceutico.entity';
import { CumplimientoSerFarmaceuticoRepository } from '../cumplimiento_s_farmaceutico.repository';
import { CumplimientoSerFarmaceuticoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/servicio_farmaceutico_dto/cumplimiento_s_farmaceutico.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoServicioFarmaceuticoService {

    constructor(
        @InjectRepository(CumplimientoSerFarmaceuticoEntity)
        private readonly cumplimientoSerFarmaceuticoRepository: CumplimientoSerFarmaceuticoRepository,
        @InjectRepository(CriterioSerFarmaceuticoEntity)
        private readonly criterioSerFarmaceuticoRepository: CriterioSerFarmaceuticoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_ser_farm_id: number): Promise<CumplimientoSerFarmaceuticoEntity> {
        const cumplimiento = await this.cumplimientoSerFarmaceuticoRepository.findOne({ where: { cump_ser_farm_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }
    //     //LISTANDO CAPACIDAD POR PRESTADOR
    // async getServicioForPrestador(id: string): Promise<CapacidadInstaladaEntity[]> {
    //     const servicio_prestador = await this.capacidadInstaladaRepository.createQueryBuilder('servicio')
    //     .select(['servicio', 'prestadores.pre_nombre'])
    //     .innerJoin('servicio.prestadores', 'prestadores')
    //     .where('prestadores.pre_cod_habilitacion = :servi_pres', { servi_pres : id})
    //     .getMany()
    //     if (!servicio_prestador) throw new NotFoundException(new MessageDto('No Existe en la lista'))
    //     return servicio_prestador
    // }

    //METODO CREAR CUMPLIMIENTO
    async create(criser_farm_id: number, eva_id: number, dto: CumplimientoSerFarmaceuticoDto): Promise<any> {
        const criterio = await this.criterioSerFarmaceuticoRepository.findOne({ where: { criser_farm_id: criser_farm_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoSerFarmaceuticoRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_ser_farmaceutico = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_serv_farma = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoSerFarmaceuticoRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoSerFarmaceuticoRepository.delete(cumplimiento.cump_ser_farm_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoSerFarmaceuticoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_ser_farm_cumple ? cumplimiento.cump_ser_farm_cumple = dto.cump_ser_farm_cumple : cumplimiento.cump_ser_farm_cumple = cumplimiento.cump_ser_farm_cumple;
        dto.cump_ser_farm_hallazgo ? cumplimiento.cump_ser_farm_hallazgo = dto.cump_ser_farm_hallazgo : cumplimiento.cump_ser_farm_hallazgo = cumplimiento.cump_ser_farm_hallazgo;
        dto.cump_ser_farm_accion ? cumplimiento.cump_ser_farm_accion = dto.cump_ser_farm_accion : cumplimiento.cump_ser_farm_accion = cumplimiento.cump_ser_farm_accion;
        dto.cump_ser_farm_responsable ? cumplimiento.cump_ser_farm_responsable = dto.cump_ser_farm_responsable : cumplimiento.cump_ser_farm_responsable = cumplimiento.cump_ser_farm_responsable;
        dto.cump_ser_farm_fecha_limite ? cumplimiento.cump_ser_farm_fecha_limite = dto.cump_ser_farm_fecha_limite : cumplimiento.cump_ser_farm_fecha_limite = cumplimiento.cump_ser_farm_fecha_limite;
        
        await this.cumplimientoSerFarmaceuticoRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
