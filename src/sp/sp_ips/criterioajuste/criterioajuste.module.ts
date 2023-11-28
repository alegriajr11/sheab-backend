import { Module } from '@nestjs/common';
import { CriterioajusteService } from './criterioajuste.service';
import { CriterioajusteController } from './criterioajuste.controller';
import { CriterioAjusteEntity } from '../criterioajuste.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionipsEntity } from '../evaluacionips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioAjusteEntity,EvaluacionipsEntity])],
  providers: [CriterioajusteService],
  controllers: [CriterioajusteController]
})
export class CriterioajusteModule {}
