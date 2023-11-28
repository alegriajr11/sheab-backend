import { Module } from '@nestjs/common';
import { EvaluacionSicService } from './evaluacion-sic.service';
import { EvaluacionSicController } from './evaluacion-sic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionSicEntity } from '../evaluacionsic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluacionSicEntity])],
  providers: [EvaluacionSicService],
  controllers: [EvaluacionSicController]
})
export class EvaluacionSicModule {}
