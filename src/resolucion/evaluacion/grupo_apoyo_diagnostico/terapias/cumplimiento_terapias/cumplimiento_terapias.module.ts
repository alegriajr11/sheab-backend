import { Module } from '@nestjs/common';
import { CumplimientoTerapiasService } from './cumplimiento_terapias.service';
import { CumplimientoTerapiasController } from './cumplimiento_terapias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioTerapiaEntity } from '../criterios_terapias.entity';
import { CumplimientoTerapiaEntity } from '../cumplimiento_terapias.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioTerapiaEntity, CumplimientoTerapiaEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoTerapiasService],
  providers: [CumplimientoTerapiasService],
  controllers: [CumplimientoTerapiasController]
})
export class CumplimientoTerapiasModule {}
