import { Module } from '@nestjs/common';
import { CumplimientoImgRadNoionizantesService } from './cumplimiento_img_rad_noionizantes.service';
import { CumplimientoImgRadNoionizantesController } from './cumplimiento_img_rad_noionizantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioImgRadNoIonizantesEntity } from '../criterio_img_rad_noionizantes.entity';
import { CumplimientoImgRadNoIonizanteEntity } from '../cumplimiento_img_rad_noionizantes.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioImgRadNoIonizantesEntity, CumplimientoImgRadNoIonizanteEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoImgRadNoionizantesService],
  providers: [CumplimientoImgRadNoionizantesService],
  controllers: [CumplimientoImgRadNoionizantesController]
})
export class CumplimientoImgRadNoionizantesModule {}
