import { Module } from '@nestjs/common';
import { CumplimientoServicioFarmaceuticoService } from './cumplimiento_servicio_farmaceutico.service';
import { CumplimientoServicioFarmaceuticoController } from './cumplimiento_servicio_farmaceutico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioSerFarmaceuticoEntity } from '../criterios_s_farmaceutico.entity';
import { CumplimientoSerFarmaceuticoEntity } from '../cumplimiento_s_farmaceutico.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioSerFarmaceuticoEntity, CumplimientoSerFarmaceuticoEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoServicioFarmaceuticoService],
  providers: [CumplimientoServicioFarmaceuticoService],
  controllers: [CumplimientoServicioFarmaceuticoController]
})
export class CumplimientoServicioFarmaceuticoModule {}
