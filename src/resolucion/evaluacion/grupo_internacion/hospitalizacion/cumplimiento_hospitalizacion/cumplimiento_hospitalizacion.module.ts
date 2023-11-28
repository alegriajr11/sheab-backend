import { Module } from '@nestjs/common';
import { CumplimientoHospitalizacionService } from './cumplimiento_hospitalizacion.service';
import { CumplimientoHospitalizacionController } from './cumplimiento_hospitalizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioHospitalizacionEntity } from '../criterio_hospitalizacion.entity';
import { CumplimientoHospitalizacionEntity } from '../cumplimiento_hospitalizacion.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';



@Module({
  imports: [TypeOrmModule.forFeature([CriterioHospitalizacionEntity, CumplimientoHospitalizacionEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoHospitalizacionService],
  providers: [CumplimientoHospitalizacionService],
  controllers: [CumplimientoHospitalizacionController]
})
export class CumplimientoHospitalizacionModule {}
