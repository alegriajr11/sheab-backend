import { Module } from '@nestjs/common';
import { EvaluacionIndController } from './evaluacion-ind.controller';
import { EvaluacionIndService } from './evaluacion-ind.service';
import { EvaluacionIndependientesEntity } from '../evaluacion-independientes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([EvaluacionIndependientesEntity])],
  controllers: [EvaluacionIndController],
  providers: [EvaluacionIndService]
})

export class EvaluacionIndModule {}
