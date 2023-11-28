import { Module } from '@nestjs/common';
import { CumplimientoCuidInterNeonatalService } from './cumplimiento_cuid_inter_neonatal.service';
import { CumplimientoCuidInterNeonatalController } from './cumplimiento_cuid_inter_neonatal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidIntermNeonatalEntity } from '../criterio_cuid_inter_neonatal.entity';
import { CumplimientoCuidInterNeonatalEntity } from '../cumplimiento_cuid_inter_neonatal.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioCuidIntermNeonatalEntity, CumplimientoCuidInterNeonatalEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoCuidInterNeonatalService],
  providers: [CumplimientoCuidInterNeonatalService],
  controllers: [CumplimientoCuidInterNeonatalController]
})
export class CumplimientoCuidInterNeonatalModule {}
