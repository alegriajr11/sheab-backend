import { Module } from '@nestjs/common';
import { CumplimientoPartoService } from './cumplimiento_parto.service';
import { CumplimientoPartoController } from './cumplimiento_parto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioPartoEntity } from '../criterio_parto.entity';
import { CumplimientoPartoEntity } from '../cumplimiento_parto.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioPartoEntity, CumplimientoPartoEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoPartoService],
  providers: [CumplimientoPartoService],
  controllers: [CumplimientoPartoController]
})
export class CumplimientoPartoModule {}
