import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioTerapiaEntity } from '../criterios_terapias.entity';
import { CriterioTerapiaRepository } from '../criterios_terapias.repository';
import { CumplimientoTerapiaEntity } from '../cumplimiento_terapias.entity';
import { CumplimientoTerapiaRepository } from '../cumplimiento_terapias.repository';
import { CumplimientoTerapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/terapias_dto/cumplimiento_terapia.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoTerapiasService {

    constructor(
        @InjectRepository(CumplimientoTerapiaEntity)
        private readonly cumplimientoTerapiaRepository: CumplimientoTerapiaRepository,
        @InjectRepository(CriterioTerapiaEntity)
        private readonly criterioTerapiaRepository: CriterioTerapiaRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_ter_id: number): Promise<CumplimientoTerapiaEntity> {
        const cumplimiento = await this.cumplimientoTerapiaRepository.findOne({ where: { cump_ter_id } });
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
    async create(criter_id: number, eva_id: number, dto: CumplimientoTerapiaDto): Promise<any> {
        const criterio = await this.criterioTerapiaRepository.findOne({ where: { criter_id: criter_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoTerapiaRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_terapia = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_terapia = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoTerapiaRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }

    

    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoTerapiaRepository.delete(cumplimiento.cump_ter_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoTerapiaDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_ter_cumple ? cumplimiento.cump_ter_cumple = dto.cump_ter_cumple : cumplimiento.cump_ter_cumple = cumplimiento.cump_ter_cumple;
        dto.cump_ter_hallazgo ? cumplimiento.cump_ter_hallazgo = dto.cump_ter_hallazgo : cumplimiento.cump_ter_hallazgo = cumplimiento.cump_ter_hallazgo;
        dto.cump_ter_accion ? cumplimiento.cump_ter_accion = dto.cump_ter_accion : cumplimiento.cump_ter_accion = cumplimiento.cump_ter_accion;
        dto.cump_ter_responsable ? cumplimiento.cump_ter_responsable = dto.cump_ter_responsable : cumplimiento.cump_ter_responsable = cumplimiento.cump_ter_responsable;
        dto.cump_ter_fecha_limite ? cumplimiento.cump_ter_fecha_limite = dto.cump_ter_fecha_limite : cumplimiento.cump_ter_fecha_limite = cumplimiento.cump_ter_fecha_limite;
        
        await this.cumplimientoTerapiaRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
