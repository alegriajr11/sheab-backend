import { Module } from '@nestjs/common';
import { CumplimientoImgRadIonizantesService } from './cumplimiento_img_rad_ionizantes.service';
import { CumplimientoImgRadIonizantesController } from './cumplimiento_img_rad_ionizantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioImgRadIonizantesEntity } from '../criterio_img_rad_ionizantes.entity';
import { CumplimientoImgRadIonizanteEntity } from '../cumplimiento_img_rad_ionizantes.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioImgRadIonizantesEntity, CumplimientoImgRadIonizanteEntity,EvaluacionResVerificacionEntity])],
  exports: [CumplimientoImgRadIonizantesService],
  providers: [CumplimientoImgRadIonizantesService],
  controllers: [CumplimientoImgRadIonizantesController]
})
export class CumplimientoImgRadIonizantesModule {}
