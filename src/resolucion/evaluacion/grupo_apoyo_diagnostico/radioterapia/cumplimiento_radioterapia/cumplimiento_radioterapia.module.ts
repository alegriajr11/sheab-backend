import { Module } from '@nestjs/common';
import { CumplimientoRadioterapiaService } from './cumplimiento_radioterapia.service';
import { CumplimientoRadioterapiaController } from './cumplimiento_radioterapia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioRadioterapiaEntity } from '../criterio_radioterapia.entity';
import { CumplimientoRadioterapiaEntity } from '../cumplimiento_radioterapia.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioRadioterapiaEntity, CumplimientoRadioterapiaEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoRadioterapiaService],
  providers: [CumplimientoRadioterapiaService],
  controllers: [CumplimientoRadioterapiaController]
})
export class CumplimientoRadioterapiaModule {}
