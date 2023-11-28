import { Module } from '@nestjs/common';
import { CumplimientoPrehospitalariaService } from './cumplimiento_prehospitalaria.service';
import { CumplimientoPrehospitalariaController } from './cumplimiento_prehospitalaria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioPrehospitalariaEntity } from '../criterio_prehospitalaria.entity';
import { CumplimientoPrehospitalariaEntity } from '../cumplimiento_prehospitalaria.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioPrehospitalariaEntity, CumplimientoPrehospitalariaEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoPrehospitalariaService],
  providers: [CumplimientoPrehospitalariaService],
  controllers: [CumplimientoPrehospitalariaController]
})
export class CumplimientoPrehospitalariaModule {}
