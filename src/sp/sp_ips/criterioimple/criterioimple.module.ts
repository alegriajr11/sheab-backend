import { Module } from '@nestjs/common';
import { CriterioimpleService } from './criterioimple.service';
import { CriterioimpleController } from './criterioimple.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioImplementacionEntity } from '../criterioimplementacion.entity';
import { EvaluacionipsEntity } from '../evaluacionips.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioImplementacionEntity,EvaluacionipsEntity])],
  providers: [CriterioimpleService],
  controllers: [CriterioimpleController]
})
export class CriterioimpleModule {}
