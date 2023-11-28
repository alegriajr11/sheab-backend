import { Module } from '@nestjs/common';
import { CumplimientoCuidIntensPediatricoService } from './cumplimiento_cuid_intens_pediatrico.service';
import { CumplimientoCuidIntensPediatricoController } from './cumplimiento_cuid_intens_pediatrico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidIntePediatricoEntity } from '../criterio_cuid_intens_pediatrico.entity';
import { CumplimientoCuidIntPediatricoEntity } from '../cumplimiento_cuid_intens_pediatrico.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioCuidIntePediatricoEntity, CumplimientoCuidIntPediatricoEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoCuidIntensPediatricoService],
  providers: [CumplimientoCuidIntensPediatricoService],
  controllers: [CumplimientoCuidIntensPediatricoController]
})
export class CumplimientoCuidIntensPediatricoModule {}
