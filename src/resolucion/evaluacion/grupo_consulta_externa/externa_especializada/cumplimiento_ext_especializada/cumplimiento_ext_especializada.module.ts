import { Module } from '@nestjs/common';
import { CumplimientoExtEspecializadaService } from './cumplimiento_ext_especializada.service';
import { CumplimientoExtEspecializadaController } from './cumplimiento_ext_especializada.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioEspecializadaEntity } from '../criterio_especializada.entity';
import { CumplimientoEspecializadaEntity } from '../cumplimiento_especializada.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioEspecializadaEntity, CumplimientoEspecializadaEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoExtEspecializadaService],
  providers: [CumplimientoExtEspecializadaService],
  controllers: [CumplimientoExtEspecializadaController]
})
export class CumplimientoExtEspecializadaModule {}
