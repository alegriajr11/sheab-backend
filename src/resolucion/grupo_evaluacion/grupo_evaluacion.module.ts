import { Module } from '@nestjs/common';
import { GrupoEvaluacionService } from './grupo_evaluacion.service';
import { GrupoEvaluacionController } from './grupo_evaluacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoEvaluacionEntity } from './grupo_evaluacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoEvaluacionEntity]),],
  providers: [GrupoEvaluacionService],
  controllers: [GrupoEvaluacionController],
  exports: [GrupoEvaluacionService]
})
export class GrupoEvaluacionModule {}
