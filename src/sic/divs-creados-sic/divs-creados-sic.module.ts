import { Module } from '@nestjs/common';
import { DivsCreadosSicController } from './divs-creados-sic.controller';
import { DivsCreadosSicService } from './divs-creados-sic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivCreadoSicEntity } from './div-creado-sic.entity';
import { EvaluacionSicEntity } from '../evaluacionsic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DivCreadoSicEntity, EvaluacionSicEntity])],
  controllers: [DivsCreadosSicController],
  providers: [DivsCreadosSicService]
})
export class DivsCreadosSicModule {}
