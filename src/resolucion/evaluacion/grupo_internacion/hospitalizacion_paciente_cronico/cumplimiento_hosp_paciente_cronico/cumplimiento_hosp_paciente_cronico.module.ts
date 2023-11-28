import { Module } from '@nestjs/common';
import { CumplimientoHospPacienteCronicoService } from './cumplimiento_hosp_paciente_cronico.service';
import { CumplimientoHospPacienteCronicoController } from './cumplimiento_hosp_paciente_cronico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioHospitCronicoEntity } from '../criterio_hosp_paciente_cron.entity';
import { CumplimientoHospitCronicoEntity } from '../cumplimiento_hosp_paciente_cron.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioHospitCronicoEntity, CumplimientoHospitCronicoEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoHospPacienteCronicoService],
  providers: [CumplimientoHospPacienteCronicoService],
  controllers: [CumplimientoHospPacienteCronicoController]
})
export class CumplimientoHospPacienteCronicoModule {}
