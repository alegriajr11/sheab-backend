import { Module } from '@nestjs/common';
import { CumplimientoMedicinaNuclearService } from './cumplimiento_medicina_nuclear.service';
import { CumplimientoMedicinaNuclearController } from './cumplimiento_medicina_nuclear.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioMedicinaNuclearEntity } from '../criterio_medicina_nuclear.entity';
import { CumplimientoMedNuclearEntity } from '../cumplimineto_medicina_nuclear.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioMedicinaNuclearEntity, CumplimientoMedNuclearEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoMedicinaNuclearService],
  providers: [CumplimientoMedicinaNuclearService],
  controllers: [CumplimientoMedicinaNuclearController]
})
export class CumplimientoMedicinaNuclearModule {}
