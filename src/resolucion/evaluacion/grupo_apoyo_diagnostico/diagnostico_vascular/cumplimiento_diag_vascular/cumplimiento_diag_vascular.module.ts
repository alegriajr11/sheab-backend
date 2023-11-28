import { Module } from '@nestjs/common';
import { CumplimientoDiagVascularService } from './cumplimiento_diag_vascular.service';
import { CumplimientoDiagVascularController } from './cumplimiento_diag_vascular.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CriterioDiagnostVascularEntity } from '../criterio_diagnost_vascular.entity';
import { CumplimientoDiagnosticoVascularEntity } from '../cumplimiento_diagnost_vascular.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioDiagnostVascularEntity, CumplimientoDiagnosticoVascularEntity,EvaluacionResVerificacionEntity])],
  providers: [CumplimientoDiagVascularService],
  controllers: [CumplimientoDiagVascularController],
  exports: [CumplimientoDiagVascularService]
})
export class CumplimientoDiagVascularModule {}


