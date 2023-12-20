import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioRadiologiaOdontoEntity } from '../criterio_radio_odont.entity';
import { CriterioRadiologiaOdontoRepository } from '../criterio_radio_odont.repository';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';
import { CumplimientoRadOdontologicaEntity } from '../cumplimiento_radio_odont.entity';
import { CumplimientoRadOdontologicaRepository } from '../cumplimiento_radio_odont.repository';
import { CumplimientoRadiologiaOdontoDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/radiologia_odont_dto/cumplimiento_radio_odont.dto';

@Injectable()
export class CumplimientoRadioOdontService {

    constructor(
        @InjectRepository(CumplimientoRadOdontologicaEntity)
        private readonly cumplimientoRadOdontologicaRepository: CumplimientoRadOdontologicaRepository,
        @InjectRepository(CriterioRadiologiaOdontoEntity)
        private readonly criterioRadiologiaOdontoRepository: CriterioRadiologiaOdontoRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //LISTAR TODOS CUMPLIMIENTOS
    async getall(): Promise<CumplimientoRadOdontologicaEntity[]> {
        const cumplimientos = await this.cumplimientoRadOdontologicaRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento'])
            .getMany()
        if (cumplimientos.length === 0) throw new NotFoundException(new MessageDto('No hay cumplimiento  en la lista'))
        return cumplimientos;
    }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_rad_odont_id: number): Promise<CumplimientoRadOdontologicaEntity> {
        const cumplimiento = await this.cumplimientoRadOdontologicaRepository.findOne({ where: { cump_rad_odont_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoRadOdontologicaEntity[]> {
        const cumplimiento = await this.cumplimientoRadOdontologicaRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_rad_odontologica.crirad_odon_nombre_criterio','rad_odontologica.rad_odont_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_rad_odontologica', 'criterio_rad_odontologica')
            .innerJoin('cumplimiento.cump_eva_radio_odont', 'cump_eva_radio_odont')
            .innerJoin('criterio_rad_odontologica.rad_odontologica', 'rad_odontologica')
            .where('cump_eva_radio_odont.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(crirad_odon_id: number, eva_id: number, dto: CumplimientoRadiologiaOdontoDto): Promise<any> {
        const criterio = await this.criterioRadiologiaOdontoRepository.findOne({ where: { crirad_odon_id: crirad_odon_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoRadOdontologicaRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_rad_odontologica = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_radio_odont = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoRadOdontologicaRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR RADIO ODONTOLOGICO
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoRadOdontologicaRepository.delete(cumplimiento.cump_rad_odont_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR RADIO ODONTOLOGICO
    async updateCapacidad(id: number, dto: CumplimientoRadiologiaOdontoDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_rad_odont_cumple ? cumplimiento.cump_rad_odont_cumple = dto.cump_rad_odont_cumple : cumplimiento.cump_rad_odont_cumple = cumplimiento.cump_rad_odont_cumple;
        dto.cump_rad_odont_hallazgo ? cumplimiento.cump_rad_odont_hallazgo = dto.cump_rad_odont_hallazgo : cumplimiento.cump_rad_odont_hallazgo = cumplimiento.cump_rad_odont_hallazgo;
        dto.cump_rad_odont_accion ? cumplimiento.cump_rad_odont_accion = dto.cump_rad_odont_accion : cumplimiento.cump_rad_odont_accion = cumplimiento.cump_rad_odont_accion;
        dto.cump_rad_odont_responsable ? cumplimiento.cump_rad_odont_responsable = dto.cump_rad_odont_responsable : cumplimiento.cump_rad_odont_responsable = cumplimiento.cump_rad_odont_responsable;
        dto.cump_rad_odont_fecha_limite ? cumplimiento.cump_rad_odont_fecha_limite = dto.cump_rad_odont_fecha_limite : cumplimiento.cump_rad_odont_fecha_limite = cumplimiento.cump_rad_odont_fecha_limite;

        await this.cumplimientoRadOdontologicaRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
