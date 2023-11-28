/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from '../actividad.entity';
import { ActividadController } from './actividad.controller';
import { ActividadService } from './actividad.service';
import { CriteriopamModule } from './criteriopam/criteriopam.module';

@Module({
  controllers: [ActividadController],
  providers: [ActividadService],
  imports: [CriteriopamModule, TypeOrmModule.forFeature([ActividadEntity])]
})
export class ActividadModule {}
