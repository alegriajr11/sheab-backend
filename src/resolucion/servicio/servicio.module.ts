import { Module } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { ServicioController } from './servicio.controller';
import { ServicioEntity } from './servicio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoEvaluacionEntity } from '../grupo_evaluacion/grupo_evaluacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicioEntity,GrupoEvaluacionEntity]),],
  providers: [ServicioService],
  controllers: [ServicioController],
  exports: [ServicioService]
})
export class ServicioModule {}
