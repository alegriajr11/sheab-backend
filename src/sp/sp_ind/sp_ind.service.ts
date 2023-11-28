import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CriterioIndEntity } from './criterioind.entity';
import { CriterioIndRepository } from './criterioind.repository';
import { EtapaInd } from './etapaind.entity';
import { EtapaIndRepository } from './etapaind.repository';
import { CalificacionIndEntity } from './calificacionind.entity';
import { CalificacionIndRepository } from './calificacionind.repository';
import { TokenDto } from 'src/auth/dto/token.dto';
import { PayloadInterface } from 'src/auth/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';
import { EvaluacionIndependientesEntity } from './evaluacion-independientes.entity';
import { EvaluacionIndependientesRepository } from './evaluacion-independientes.repository';
import { CalificacionindDto } from './dto/calificacionind.dto';


@Injectable()
export class SpIndService {

    constructor(
        @InjectRepository(EtapaInd)

        private etapaIndRepository: EtapaIndRepository,
        @InjectRepository(CriterioIndEntity)
        private criterioIndRepository: CriterioIndRepository,
        private readonly jwtService: JwtService,
        @InjectRepository(CalificacionIndEntity)
        private calificacionIndRepository: CalificacionIndRepository,
        @InjectRepository(EvaluacionIndependientesEntity)
        private evaluacionIndependientesRepository: EvaluacionIndependientesRepository,
        private readonly auditoria_registro_services: AuditoriaRegistroService

    ) { }

    //LISTAR ETAPAS DE IND
    async getall(): Promise<EtapaInd[]> {
        const criterios = await this.etapaIndRepository.find();
        if (!criterios.length) throw new NotFoundException(new MessageDto('No hay etapas en la lista'))
        return criterios;
    }

    async findByIdcalificacion(cal_id: number): Promise<CalificacionIndEntity> {
        const calificacion = await this.calificacionIndRepository.findOne({ where: { cal_id } });
        if (!calificacion) {
            throw new NotFoundException(new MessageDto('No Existe'));
        }
        return calificacion;
    }
    
  

    // //criterio por titulo
    // async getallcriterioxtitulo2(): Promise<CalificacionIndEntity[]> {

    //     let titulo_uno
    //     titulo_uno = "COMPROMISO DEL PROFESIONAL INDEPENDIENTE CON LA ATENCION  SEGURA DEL PACIENTE"

    //     const criterio = await this.calificacionIndRepository.createQueryBuilder('etapa')
    //         .select(['etapa',, 'criterio_cal.cri_id', 'criterio_cal.cri_nombre', 'criterio_cal.cri_verificacion', 'eta_item.eta_nombre'])
    //         .innerJoin('etapa.criterio_cal', 'criterio_cal')
    //         .innerJoinAndSelect('criterio_cal.eta_item', 'eta_item')
    //         .where('eta_item.eta_nombre LIKE :titulo', { titulo: titulo_uno })
    //         .getMany()

    //     return criterio
    // }

    // 

    //ACTUALIZACION CALIFICACION SP INDEPENDIENTES
    async update(id: number, dto: CalificacionindDto): Promise<any> {

        try {
            const calificacion = await this.findByIdcalificacion(id);
            if (!calificacion)
                throw new NotFoundException(new MessageDto('El Criterio No Existe'));

            dto.cal_nota ? calificacion.cal_nota = dto.cal_nota : calificacion.cal_nota = calificacion.cal_nota;
            dto.cal_observaciones ? calificacion.cal_observaciones = dto.cal_observaciones : calificacion.cal_observaciones = calificacion.cal_observaciones;


            await this.calificacionIndRepository.save(calificacion);

            return new MessageDto(`La calificacion ha sido Actualizada`);

        } catch (error) {
            throw new InternalServerErrorException(new MessageDto(error.message));
        }
    }
}
