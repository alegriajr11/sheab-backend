import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioRadioterapiaEntity } from '../criterio_radioterapia.entity';
import { CriterioRadioterapiaRepository } from '../criterio_radioterapia.repository';
import { CumplimientoRadioterapiaEntity } from '../cumplimiento_radioterapia.entity';
import { CumplimientoRadioterapiaRepository } from '../cumplimiento_radioterapia.repository';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { EvaluacionResVerificacionRepository } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.repository';
import { CumplimientoRadioterapiaDto } from 'src/resolucion/dtos/evaluacion_dtos/grupo_apoyo_diagnostico_dtos/radioterapia_dto/cumplimiento_radioterapia.dto';

@Injectable()
export class CumplimientoRadioterapiaService {

    constructor(
        @InjectRepository(CumplimientoRadioterapiaEntity)
        private readonly cumplimientoRadioterapiaRepository: CumplimientoRadioterapiaRepository,
        @InjectRepository(CriterioRadioterapiaEntity)
        private readonly criterioRadioterapiaRepository: CriterioRadioterapiaRepository,
        @InjectRepository(EvaluacionResVerificacionEntity)
        private readonly evaluacionResRepository: EvaluacionResVerificacionRepository,
    ) { }

    //LISTAR TODOS CUMPLIMIENTOS
    async getall(): Promise<CumplimientoRadioterapiaEntity[]> {
        const cumplimientos = await this.cumplimientoRadioterapiaRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento'])
            .getMany()
        if (cumplimientos.length === 0) throw new NotFoundException(new MessageDto('No hay cumplimiento  en la lista'))
        return cumplimientos;
    }

    //ENCONTRAR POR ID - CUMPLIMIENTO
    async findById(cump_rad_ter_id: number): Promise<CumplimientoRadioterapiaEntity> {
        const cumplimiento = await this.cumplimientoRadioterapiaRepository.findOne({ where: { cump_rad_ter_id } });
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento No Existe'));
        }
        return cumplimiento;
    }

    //LISTANDO CUMPLIMIENTOS POR evaluacion
    async getCumplimientoForEva(id: number): Promise<CumplimientoRadioterapiaEntity[]> {
        const cumplimiento = await this.cumplimientoRadioterapiaRepository.createQueryBuilder('cumplimiento')
            .select(['cumplimiento', 'criterio_radioterapia.crirad_ter_nombre_criterio','radioterapia.radi_nombre_estandar'])
            .innerJoin('cumplimiento.criterio_radioterapia', 'criterio_radioterapia')
            .innerJoin('cumplimiento.cump_eva_radio', 'cump_eva_radio')
            .innerJoin('criterio_radioterapia.radioterapia', 'radioterapia')
            .where('cump_eva_radio.eva_id = :id_evad', { id_evad: id })
            .getMany()
        if (!cumplimiento) throw new NotFoundException(new MessageDto('No Existe en la lista'))
        return cumplimiento
    }

    //METODO CREAR CUMPLIMIENTO
    async create(crirad_ter_id: number, eva_id: number, dto: CumplimientoRadioterapiaDto): Promise<any> {
        const criterio = await this.criterioRadioterapiaRepository.findOne({ where: { crirad_ter_id: crirad_ter_id } });
        if (!criterio) throw new InternalServerErrorException(new MessageDto('El criterio no ha sido creado'))

        const evaluacion = await this.evaluacionResRepository.findOne({ where: { eva_id: eva_id } });
        if (!evaluacion) throw new InternalServerErrorException(new MessageDto('La evaluacion no ha sido creada'))

        //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
        const cumplimiento = this.cumplimientoRadioterapiaRepository.create(dto)

        //ASIGNAMOS EL criterio AL cumplimiento
        cumplimiento.criterio_radioterapia = criterio

        //ASIGNAMOS EL evaluacion AL cumplimiento
        cumplimiento.cump_eva_radio = evaluacion
        //GUARDAR LOS DATOS EN LA BD
        await this.cumplimientoRadioterapiaRepository.save(cumplimiento)
        return new MessageDto('El cumplimiento ha sido Creada Correctamente');
    }



    //ELIMINAR CUMPLIMIENTO RADIOTERAPIA
    async delete(id: number): Promise<any> {
        const cumplimiento = await this.findById(id);
        await this.cumplimientoRadioterapiaRepository.delete(cumplimiento.cump_rad_ter_id)
        return new MessageDto(`cumplimiento Eliminado`);
    }

    //ACTUALIZAR CUMPLIMIENTO RADIOTERAPIA
    async updateCapacidad(id: number, dto: CumplimientoRadioterapiaDto): Promise<any> {
        const cumplimiento = await this.findById(id);
        if (!cumplimiento) {
            throw new NotFoundException(new MessageDto('El cumplimiento no existe'))
        }
        dto.cump_rad_ter_cumple ? cumplimiento.cump_rad_ter_cumple = dto.cump_rad_ter_cumple : cumplimiento.cump_rad_ter_cumple = cumplimiento.cump_rad_ter_cumple;
        dto.cump_rad_ter_hallazgo ? cumplimiento.cump_rad_ter_hallazgo = dto.cump_rad_ter_hallazgo : cumplimiento.cump_rad_ter_hallazgo = cumplimiento.cump_rad_ter_hallazgo;
        dto.cump_rad_ter_accion ? cumplimiento.cump_rad_ter_accion = dto.cump_rad_ter_accion : cumplimiento.cump_rad_ter_accion = cumplimiento.cump_rad_ter_accion;
        dto.cump_rad_ter_responsable ? cumplimiento.cump_rad_ter_responsable = dto.cump_rad_ter_responsable : cumplimiento.cump_rad_ter_responsable = cumplimiento.cump_rad_ter_responsable;
        dto.cump_rad_ter_fecha_limite ? cumplimiento.cump_rad_ter_fecha_limite = dto.cump_rad_ter_fecha_limite : cumplimiento.cump_rad_ter_fecha_limite = cumplimiento.cump_rad_ter_fecha_limite;

        await this.cumplimientoRadioterapiaRepository.save(cumplimiento);

        return new MessageDto(`El cumplimiento ha sido Actualizado`);

    }
}
