import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioPartoEntity } from '../criterio_parto.entity';
import { CriterioPartoRepository } from '../criterio_parto.repository';
import { CumplimientoPartoEntity } from '../cumplimiento_parto.entity';
import { CumplimientoPartoRepository } from '../cumplimiento_parto.repository';
import { CumplimientoPartoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/parto_dto/cumplimiento_parto.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoPartoService {
    constructor(
    @InjectRepository(CumplimientoPartoEntity)
    private readonly cumplimientoPartoRepository: CumplimientoPartoRepository,
    @InjectRepository(CriterioPartoEntity)
    private readonly criterioPartoRepository: CriterioPartoRepository,
    @InjectRepository(EvaluacionResVerificacionEntity)
    private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
) { }

//ENCONTRAR POR ID - CUMPLIMIENTO
async findById(cump_parto_id: number): Promise<CumplimientoPartoEntity> {
    const cumplimiento = await this.cumplimientoPartoRepository.findOne({ where: { cump_parto_id } });
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
async create(criparto_id: number, eva_id: number, dto: CumplimientoPartoDto): Promise<any> {
    const criterio = await this.criterioPartoRepository.findOne({ where: { criparto_id: criparto_id } });
    if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

    const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
    if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

    //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
    const cumplimiento = this.cumplimientoPartoRepository.create(dto)

    //ASIGNAMOS EL criterio AL cumplimiento
    cumplimiento.criterio_parto = criterio

    //ASIGNAMOS EL evaluacion AL cumplimiento
    cumplimiento.cump_eva_parto = evaluacion
    //GUARDAR LOS DATOS EN LA BD
    await this.cumplimientoPartoRepository.save(cumplimiento)
    return new MessageDto('El cumplimiento ha sido Creada Correctamente');
}



//ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
async delete(id: number): Promise<any> {
    const cumplimiento = await this.findById(id);
    await this.cumplimientoPartoRepository.delete(cumplimiento.cump_parto_id)
    return new MessageDto(`cumplimiento Eliminado`);
}

//ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
async updateCapacidad(id: number, dto: CumplimientoPartoDto): Promise<any> {
    const cumplimiento = await this.findById(id);
    if (!cumplimiento) {
        throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
    }
    dto.cump_parto_cumple ? cumplimiento.cump_parto_cumple = dto.cump_parto_cumple : cumplimiento.cump_parto_cumple = cumplimiento.cump_parto_cumple;
    dto.cump_parto_hallazgo ? cumplimiento.cump_parto_hallazgo = dto.cump_parto_hallazgo : cumplimiento.cump_parto_hallazgo = cumplimiento.cump_parto_hallazgo;
    dto.cump_parto_accion ? cumplimiento.cump_parto_accion = dto.cump_parto_accion : cumplimiento.cump_parto_accion = cumplimiento.cump_parto_accion;
    dto.cump_parto_responsable ? cumplimiento.cump_parto_responsable = dto.cump_parto_responsable : cumplimiento.cump_parto_responsable = cumplimiento.cump_parto_responsable;
    dto.cump_parto_fecha_limite ? cumplimiento.cump_parto_fecha_limite = dto.cump_parto_fecha_limite : cumplimiento.cump_parto_fecha_limite = cumplimiento.cump_parto_fecha_limite;
    
    await this.cumplimientoPartoRepository.save(cumplimiento);

    return new MessageDto(`El cumplimiento ha sido Actualizado`);

}
}
