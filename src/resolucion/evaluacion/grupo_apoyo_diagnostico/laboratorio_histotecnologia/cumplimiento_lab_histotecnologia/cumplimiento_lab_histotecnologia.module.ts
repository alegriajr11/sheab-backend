import { Module } from '@nestjs/common';
import { CumplimientoLabHistotecnologiaService } from './cumplimiento_lab_histotecnologia.service';
import { CumplimientoLabHistotecnologiaController } from './cumplimiento_lab_histotecnologia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioLabHistotecnologiaEntity } from '../criterio_lab_histotec.entity';
import { CumplimientoLabHistotecnEntity } from '../cumplimiento_lab_histotec.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioLabHistotecnologiaEntity, CumplimientoLabHistotecnEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoLabHistotecnologiaService],
  providers: [CumplimientoLabHistotecnologiaService],
  controllers: [CumplimientoLabHistotecnologiaController]
})
export class CumplimientoLabHistotecnologiaModule {}
