import { Module } from '@nestjs/common';
import { CumplimientoDialisisService } from './cumplimiento_dialisis.service';
import { CumplimientoDialisisController } from './cumplimiento_dialisis.controller';
import { CriterioDialisisEntity } from '../criterio_dialisis.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CumplimientoDialisisEntity } from '../cumplimiento_dialisis.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioDialisisEntity, CumplimientoDialisisEntity,EvaluacionResVerificacionEntity])],
  providers: [CumplimientoDialisisService],
  controllers: [CumplimientoDialisisController],
  exports: [CumplimientoDialisisService]
})
export class CumplimientoDialisisModule {}
