import { Module } from '@nestjs/common';
import { CumplimientoLabClinicoService } from './cumplimiento_lab_clinico.service';
import { CumplimientoLabClinicoController } from './cumplimiento_lab_clinico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioLabClinicoEntity } from '../criterio_lab_clinico.entity';
import { CumplimientoLabClinicoEntity } from '../cumplimiento_lab_clinico.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioLabClinicoEntity, CumplimientoLabClinicoEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoLabClinicoService],
  providers: [CumplimientoLabClinicoService],
  controllers: [CumplimientoLabClinicoController]
})
export class CumplimientoLabClinicoModule {}
