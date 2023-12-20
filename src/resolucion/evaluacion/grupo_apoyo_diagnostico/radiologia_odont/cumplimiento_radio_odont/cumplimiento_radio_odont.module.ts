import { Module } from '@nestjs/common';
import { CumplimientoRadioOdontService } from './cumplimiento_radio_odont.service';
import { CumplimientoRadioOdontController } from './cumplimiento_radio_odont.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioRadiologiaOdontoEntity } from '../criterio_radio_odont.entity';
import { CumplimientoRadOdontologicaEntity } from '../cumplimiento_radio_odont.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioRadiologiaOdontoEntity, CumplimientoRadOdontologicaEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoRadioOdontService],
  providers: [CumplimientoRadioOdontService],
  controllers: [CumplimientoRadioOdontController]
})
export class CumplimientoRadioOdontModule {}
