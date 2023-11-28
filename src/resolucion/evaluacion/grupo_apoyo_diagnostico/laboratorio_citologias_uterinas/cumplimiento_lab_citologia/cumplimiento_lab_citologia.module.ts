import { Module } from '@nestjs/common';
import { CumplimientoLabCitologiaService } from './cumplimiento_lab_citologia.service';
import { CumplimientoLabCitologiaController } from './cumplimiento_lab_citologia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioLabUterinaEntity } from '../criterio_lab_citologia_uterina.entity';
import { CumplimientoLabUterinaEntity } from '../cumplimiento_lab_citologia_uterina.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioLabUterinaEntity, CumplimientoLabUterinaEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoLabCitologiaService],
  providers: [CumplimientoLabCitologiaService],
  controllers: [CumplimientoLabCitologiaController]
})
export class CumplimientoLabCitologiaModule {}
