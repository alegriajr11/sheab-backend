import { Module } from '@nestjs/common';
import { CumplimientoCuidIntensNeonatalService } from './cumplimiento_cuid_intens_neonatal.service';
import { CumplimientoCuidIntensNeonatalController } from './cumplimiento_cuid_intens_neonatal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidInteNeonatalEntity } from '../criterio_cuid_intens_neonatal.entity';
import { CumplimientoCuidIntNeonatalEntity } from '../cumplimiento_cuid_intens_neonatal.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioCuidInteNeonatalEntity, CumplimientoCuidIntNeonatalEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoCuidIntensNeonatalService],
  providers: [CumplimientoCuidIntensNeonatalService],
  controllers: [CumplimientoCuidIntensNeonatalController]
})
export class CumplimientoCuidIntensNeonatalModule {}
