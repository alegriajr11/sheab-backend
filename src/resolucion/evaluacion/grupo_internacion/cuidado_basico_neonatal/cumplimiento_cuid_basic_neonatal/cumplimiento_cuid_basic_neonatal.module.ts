import { Module } from '@nestjs/common';
import { CumplimientoCuidBasicNeonatalService } from './cumplimiento_cuid_basic_neonatal.service';
import { CumplimientoCuidBasicNeonatalController } from './cumplimiento_cuid_basic_neonatal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidBasNeonatalEntity } from '../criterio_cuid_basic_neonatal.entity';
import { CumplimientoCuidBasNeonatalEntity } from '../cumplimiento_cuid_basic_neonatal.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioCuidBasNeonatalEntity, CumplimientoCuidBasNeonatalEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoCuidBasicNeonatalService],
  providers: [CumplimientoCuidBasicNeonatalService],
  controllers: [CumplimientoCuidBasicNeonatalController]
})
export class CumplimientoCuidBasicNeonatalModule {}
