import { Module } from '@nestjs/common';
import { EvaluacionpamecService } from './evaluacionpamec.service';
import { EvaluacionpamecController } from './evaluacionpamec.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionPamecEntity } from '../evaluacion-pamec.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EvaluacionPamecEntity])],
  providers: [EvaluacionpamecService],
  controllers: [EvaluacionpamecController]
})
export class EvaluacionpamecModule {}
