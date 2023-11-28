import { Module } from '@nestjs/common';
import { EvaluacionipsService } from './evaluacionips.service';
import { EvaluacionipsController } from './evaluacionips.controller';
import { EvaluacionipsEntity } from '../evaluacionips.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActaSpIpsEntity } from 'src/generarpdf/sp/sp-ips/sp-ips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluacionipsEntity,ActaSpIpsEntity])],
  providers: [EvaluacionipsService],
  controllers: [EvaluacionipsController]
})
export class EvaluacionipsModule {}
