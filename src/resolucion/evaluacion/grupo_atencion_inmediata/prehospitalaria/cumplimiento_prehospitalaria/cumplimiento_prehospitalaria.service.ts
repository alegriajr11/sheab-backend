import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioPrehospitalariaEntity } from '../criterio_prehospitalaria.entity';
import { CriterioPrehospitalariaRepository } from '../criterio_prehospitalaria.repository';
import { CumplimientoPrehospitalariaEntity } from '../cumplimiento_prehospitalaria.entity';
import { CumplimientoPrehospitalariaRepository } from '../cumplimiento_prehospitalaria.repository';
import { CumplimientoPrehospitalariaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_atencion_inmediata_dtos/prehospitalaria_dto/cumplimiento_prehospitalaria.dto';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';

@Injectable()
export class CumplimientoPrehospitalariaService {

    constructor(
        @InjectRepository(CumplimientoPrehospitalariaEntity)
        private readonly cumplimientoPrehospitalariaRepository: CumplimientoPrehospitalariaRepository,
        @InjectRepository(CriterioPrehospitalariaEntity)
        private readonly criterioPrehospitalariaRepository: CriterioPrehospitalariaRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }
    
    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_preh_id: number): Promise<CumplimientoPrehospitalariaEntity> {
        const cumplimiento = await this.cumplimientoPrehospitalariaRepository.findOne({ where: { cump_preh_id } });
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
    async create(cripreh_id: number, eva_id: number, dto: CumplimientoPrehospitalariaDto): Promise<any> {
        const criterio = await this.criterioPrehospitalariaRepository.findOne({ where: { cripreh_id: cripreh_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))
    
        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))
    
        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoPrehospitalariaRepository.create(dto)
    
        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_prehospitalaria = criterio
    
        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_prehospi = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoPrehospitalariaRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }
    
    
    
    //ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoPrehospitalariaRepository.delete(cumplimiento.cump_preh_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }
    
    //ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
    async updateCapacidad(id: number, dto: CumplimientoPrehospitalariaDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_preh_cumple ? cumplimiento.cump_preh_cumple = dto.cump_preh_cumple : cumplimiento.cump_preh_cumple = cumplimiento.cump_preh_cumple;
        dto.cump_preh_hallazgo ? cumplimiento.cump_preh_hallazgo = dto.cump_preh_hallazgo : cumplimiento.cump_preh_hallazgo = cumplimiento.cump_preh_hallazgo;
        dto.cump_preh_accion ? cumplimiento.cump_preh_accion = dto.cump_preh_accion : cumplimiento.cump_preh_accion = cumplimiento.cump_preh_accion;
        dto.cump_preh_responsable ? cumplimiento.cump_preh_responsable = dto.cump_preh_responsable : cumplimiento.cump_preh_responsable = cumplimiento.cump_preh_responsable;
        dto.cump_preh_fecha_limite ? cumplimiento.cump_preh_fecha_limite = dto.cump_preh_fecha_limite : cumplimiento.cump_preh_fecha_limite = cumplimiento.cump_preh_fecha_limite;
        
        await this.cumplimientoPrehospitalariaRepository.save(cumplimiento);
    
        return new MessageDto(`El cumplimiento ha sido Actualizado`);
    
    }
}
