import { Module } from '@nestjs/common';
import { CumplimientoSaludTrabajoService } from './cumplimiento_salud_trabajo.service';
import { CumplimientoSaludTrabajoController } from './cumplimiento_salud_trabajo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioSaludTrabajoEntity } from '../criterios_salud_trabajo.entity';
import { CumplimientoSaludTrabajoEntity } from '../cumplimiento_salud_trabajo.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioSaludTrabajoEntity, CumplimientoSaludTrabajoEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoSaludTrabajoService],
  providers: [CumplimientoSaludTrabajoService],
  controllers: [CumplimientoSaludTrabajoController]
})
export class CumplimientoSaludTrabajoModule {}
