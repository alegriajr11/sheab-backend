import { Controller, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DominioEntity } from '../dominio.entity';
import { IndicadorEntity } from '../indicador.entity';
import { CriteriosicController } from './criteriosic.controller';
import { CriteriosicService } from './criteriosic.service';
import { IndicadorModule } from './indicador/indicador.module';
import { CriterioController } from './criterio/criterio.controller';
import { CriterioService } from './criterio/criterio.service';
import { CriterioModule } from './criterio/criterio.module';
import { CriteriosicEntity } from '../criteriosic.entity';
import { CriterioEstandarSicEntity } from '../criteriosEstandar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DominioEntity]), 
  TypeOrmModule.forFeature([IndicadorEntity]), 
  TypeOrmModule.forFeature([CriteriosicEntity, CriterioEstandarSicEntity]), 
  IndicadorModule, CriterioModule],
  
  providers: [CriteriosicService, CriterioService],
  controllers: [CriteriosicController, CriterioController]
})
export class CriteriosicModule {}
