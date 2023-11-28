import { Module } from '@nestjs/common';
import { CumplimientoTodosServiciosService } from './cumplimiento_todos_servicios.service';
import { CumplimientoTodosServiciosController } from './cumplimiento_todos_servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Criterio_servicios } from '../servicios/criterio_servicios.entity';
import { CumplimientoServiciosEntity } from '../servicios/cumplimiento_servicios.entity';
import { EvaluacionResVerificacionEntity } from '../../evaluacion_resolucion_verificacion/evaluacion_res.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Criterio_servicios, CumplimientoServiciosEntity, EvaluacionResVerificacionEntity])],
  exports: [CumplimientoTodosServiciosService],
  providers: [CumplimientoTodosServiciosService],
  controllers: [CumplimientoTodosServiciosController]
})
export class CumplimientoTodosServiciosModule {}
