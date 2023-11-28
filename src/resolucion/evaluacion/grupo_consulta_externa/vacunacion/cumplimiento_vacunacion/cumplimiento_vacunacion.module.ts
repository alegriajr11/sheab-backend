import { Module } from '@nestjs/common';
import { CumplimientoVacunacionService } from './cumplimiento_vacunacion.service';
import { CumplimientoVacunacionController } from './cumplimiento_vacunacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioVacunacionEntity } from '../criterio_vacunacion.entity';
import { CumplimientoVacunacionEntity } from '../cumplimiento_vacunacion.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioVacunacionEntity, CumplimientoVacunacionEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoVacunacionService],
  providers: [CumplimientoVacunacionService],
  controllers: [CumplimientoVacunacionController]
})
export class CumplimientoVacunacionModule {}
