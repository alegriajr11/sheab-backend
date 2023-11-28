import { Module } from '@nestjs/common';
import { CriterioverifService } from './criterioverif.service';
import { CriterioverifController } from './criterioverif.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioVerificacionEntity } from '../criterioverificacion.entity';
import { EvaluacionipsEntity } from '../evaluacionips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioVerificacionEntity,EvaluacionipsEntity])],
  providers: [CriterioverifService],
  controllers: [CriterioverifController]
})
export class CriterioverifModule {}
