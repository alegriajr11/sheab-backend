import { Module } from '@nestjs/common';
import { PlaneacionService } from './planeacion.service';
import { PlaneacionController } from './planeacion.controller';
import { CriterioPlaneacionEntity } from '../criterioplaneacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionipsEntity } from '../evaluacionips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioPlaneacionEntity, EvaluacionipsEntity])],
  providers: [PlaneacionService],
  controllers: [PlaneacionController]
})
export class PlaneacionModule {}
