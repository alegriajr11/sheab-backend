import { Module } from '@nestjs/common';
import { CumplimientoHemodIntervenService } from './cumplimiento_hemod_interven.service';
import { CumplimientoHemodIntervenController } from './cumplimiento_hemod_interven.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioHermoIntervenEntity } from '../criterio_hemo_inter.entity';
import { CumplimientoHermoIntervenEntity } from '../cumplimiento_hemo_inter.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioHermoIntervenEntity, CumplimientoHermoIntervenEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoHemodIntervenService],
  providers: [CumplimientoHemodIntervenService],
  controllers: [CumplimientoHemodIntervenController]
})
export class CumplimientoHemodIntervenModule {}
