import { Module } from '@nestjs/common';
import { CumplimientoGestionPretransService } from './cumplimiento_gestion_pretrans.service';
import { CumplimientoGestionPretransController } from './cumplimiento_gestion_pretrans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioGestionPretransfusionalEntity } from '../criterio_gestion_pretrans.entity';
import { CumplimientoGestionPretransfusionalEntity } from '../cumplimiento_gestion_pretrans.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioGestionPretransfusionalEntity, CumplimientoGestionPretransfusionalEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoGestionPretransService],
  providers: [CumplimientoGestionPretransService],
  controllers: [CumplimientoGestionPretransController]
})
export class CumplimientoGestionPretransModule {}
