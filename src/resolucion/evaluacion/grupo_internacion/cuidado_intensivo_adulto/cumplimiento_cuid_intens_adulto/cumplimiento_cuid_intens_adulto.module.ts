import { Module } from '@nestjs/common';
import { CumplimientoCuidIntensAdultoService } from './cumplimiento_cuid_intens_adulto.service';
import { CumplimientoCuidIntensAdultoController } from './cumplimiento_cuid_intens_adulto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidIntensAdultoEntity } from '../criterio_cuid_intens_adulto.entity';
import { CumplimientoIntAdultoEntity } from '../cumplimiento_cuid_intens_adulto.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioCuidIntensAdultoEntity, CumplimientoIntAdultoEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoCuidIntensAdultoService],
  providers: [CumplimientoCuidIntensAdultoService],
  controllers: [CumplimientoCuidIntensAdultoController]
})
export class CumplimientoCuidIntensAdultoModule {}
